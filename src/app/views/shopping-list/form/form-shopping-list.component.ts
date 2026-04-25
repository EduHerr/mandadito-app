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

  async onAdd(): Promise<void> {
    if (this.fShoppingList.invalid) {
      this.fShoppingList.markAllAsTouched();
      this.fShoppingList.markAsDirty();
      return;
    }

    // Get value from numeric fields
    const [quantity, unit_cost] = this.numericFields.toArray().map(field => field.value);
    const cantidad = Number(quantity);
    const costoUnitario = Number(unit_cost);

    const costoTotal = Number(quantity) * Number(unit_cost);
    this.totalCost += costoTotal;

    // Mapping the product
    const product: IProductSchema = {
      quantity: cantidad,
      unit_cost: costoUnitario,
      totalCost: cantidad * costoUnitario,
      ...this.fShoppingList.value
    };
    
    //Save the product in the db
    const added = await this.productService.add(product);

    //
    this.oAddProduct.emit(added);
    this.clearNumericFields();
    this.fShoppingList.reset();
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
  }

  async onUpdate(): Promise<void> {
    //Validate form
    if (this.fShoppingList.invalid) {
      this.fShoppingList.markAllAsTouched();
      this.fShoppingList.markAsDirty();
      return;
    }

    //Update
    let [quantity, unit_cost] = this.numericFields.toArray().map(field => field.value);
    const cantidad = Number(quantity);
    const costoUnitario = Number(unit_cost);
    const costoTotal = Number(cantidad) * Number(costoUnitario);

    const updated = await this.productService.update(`${this.productItem._id}`, {
      ...this.fShoppingList.value,
      quantity: cantidad,
      unit_cost: costoUnitario,
      totalCost: costoTotal
    });
    this.oUpdateProduct.emit(updated);

    //Update totalCost
    const previousTotalCost = this.productItem.totalCost ?? 0;
    this.totalCost = (this.totalCost - previousTotalCost) + costoTotal;

    //Clear form
    this.editMode = false;
    this.fShoppingList.reset();
    this.clearNumericFields();
  }

  private clearNumericFields(): void {
    this.numericFields.forEach((field) => field.value = "");
  }
}
