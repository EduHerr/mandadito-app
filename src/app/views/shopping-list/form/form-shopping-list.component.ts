import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NumericFieldComponent } from '@components/field/numeric/numeric-field.component';
import { IProductSchema } from '@libs/modules/persistent/products/schema';
import { ProductService } from '@libs/modules/persistent/products/service';
import { ListNameField } from './listname-field/listname-field.component';

@Component({
  imports: [
    CommonModule,
    NumericFieldComponent, 
    ReactiveFormsModule,
    ListNameField
  ],
  selector: 'form-shopping-list',
  providers: [
    ProductService
  ],
  templateUrl: './form-shopping-list.component.html',
  styleUrls: ['./form-shopping-list.component.css'],
})
export class FormShoppingList implements OnInit {
  @Output() oSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() oAddProduct: EventEmitter<IProductSchema> = new EventEmitter<IProductSchema>();
  @Output() oUpdateProduct: EventEmitter<IProductSchema> = new EventEmitter<IProductSchema>();
  @ViewChildren(NumericFieldComponent) numericFields!: QueryList<NumericFieldComponent>;
  @ViewChild(ListNameField) lstNameField!: ListNameField;
  
  fShoppingList!: FormGroup;
  totalCost: number = 0;
  editMode: boolean = false;
  productItem!: IProductSchema;
  shakeForm: boolean = false;
  numericErrors: Record<string, boolean> = {};

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fShoppingList = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
        ],
      ],
      description: [
        '',
        [
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,#$]+$/),
          Validators.minLength(5),
          Validators.maxLength(1000),
        ],
      ],
      isPromo: [false]
    });
  }

  /** Triggers the shake animation on the form, auto-clears after animation ends */
  private triggerShake(): void {
    this.shakeForm = false;
    // Force reflow so the animation can replay
    requestAnimationFrame(() => {
      this.shakeForm = true;
      setTimeout(() => this.shakeForm = false, 500);
    });
  }

  /** Validates all fields (reactive form + numeric), returns true if valid */
  private validateAll(): boolean {
    let valid = true;

    // Validate reactive form fields
    if (this.fShoppingList.invalid) {
      this.fShoppingList.markAllAsTouched();
      this.fShoppingList.markAsDirty();
      valid = false;
    }

    // Validate numeric fields
    const fields = this.numericFields.toArray();
    this.numericErrors = {};

    fields.forEach((field) => {
      if (!field.isValid()) {
        const label = field.id === 'cantiadadField' ? 'quantity' : 'price';
        const msg = field.id === 'cantiadadField' ? 'Ingresa la cantidad' : 'Ingresa el precio';
        field.markError(msg);
        this.numericErrors[label] = true;
        valid = false;
      } else {
        field.clearError();
      }
    });

    if (!valid) {
      this.triggerShake();
    }

    return valid;
  }

  async onAdd(): Promise<void> {
    if (!this.validateAll()) return;

    // Get value from numeric fields
    const [quantity, unit_cost] = this.numericFields.toArray().map(field => field.value);
    const cantidad = Number(quantity);
    const costoUnitario = Number(unit_cost);

    const costoTotal = cantidad * costoUnitario;
    this.totalCost += costoTotal;

    // Build complete product with local ID for immediate UI update
    const product: IProductSchema = {
      _id: crypto.randomUUID(),
      quantity: cantidad,
      unit_cost: costoUnitario,
      totalCost: costoTotal,
      lastUpdated: Date.now(),
      ...this.fShoppingList.value
    };

    // Emit FIRST — synchronous, within Angular's zone (guaranteed render)
    this.oAddProduct.emit(product);
    this.clearNumericFields();
    this.fShoppingList.reset();

    // Save to DB in background (optimistic update)
    try {
      await this.productService.addWithId(product);
    } catch (err) {
      console.error('Error saving product to DB:', err);
    }
  }

  onSave(): void {
    this.oSave.emit();
  }

  onEdit(product: IProductSchema): void {
    this.editMode = true;
    this.fShoppingList.patchValue({ ...product });
    this.productItem = product;
    this.numericFields.forEach((field) => {
      if(field.id === 'cantiadadField'){
        field.value = product?.quantity?.toString() ?? '0';
      }
      if(field.id === 'unitCostField'){
        field.value = product?.unit_cost?.toString() ?? '0';
      }
    });
    // Clear any stale errors
    this.numericErrors = {};
  }

  async onUpdate(): Promise<void> {
    if (!this.validateAll()) return;

    //Update
    let [quantity, unit_cost] = this.numericFields.toArray().map(field => field.value);
    const cantidad = Number(quantity);
    const costoUnitario = Number(unit_cost);
    const costoTotal = Number(cantidad) * Number(costoUnitario);

    // Snapshot form values before reset (DB write happens after reset)
    const formValue = this.fShoppingList.value;
    const productId = `${this.productItem._id}`;

    // Build updated product locally for immediate UI update
    const updated: IProductSchema = {
      ...this.productItem,
      ...formValue,
      quantity: cantidad,
      unit_cost: costoUnitario,
      totalCost: costoTotal,
      lastUpdated: Date.now(),
    };

    // Emit FIRST — synchronous, within Angular's zone (guaranteed render)
    this.oUpdateProduct.emit(updated);

    //Update totalCost
    const previousTotalCost = this.productItem.totalCost ?? 0;
    this.totalCost = (this.totalCost - previousTotalCost) + costoTotal;

    //Clear form
    this.editMode = false;
    this.fShoppingList.reset();
    this.clearNumericFields();

    // Persist to DB in background (optimistic update)
    try {
      await this.productService.update(productId, {
        ...formValue,
        quantity: cantidad,
        unit_cost: costoUnitario,
        totalCost: costoTotal,
      });
    } catch (err) {
      console.error('Error updating product in DB:', err);
    }
  }

  private clearNumericFields(): void {
    this.numericErrors = {};
    this.numericFields.forEach((field) => {
      field.value = "";
      field.clearError();
    });
  }
}
