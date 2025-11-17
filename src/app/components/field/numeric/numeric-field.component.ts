import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { onlyNumbers } from "@libs/utils/validators/numeric";

@Component({
    imports: [
        CommonModule,
        FormsModule
    ],
    standalone: true,
    selector: 'numeric-field',
    templateUrl: './numeric-field.component.html'
})
export class NumericFieldComponent {
    @Input() id: string = '';
    @Input() min: number = 0;
    @Input() max: number = 1000000;
    @Input() placeholder: string = '';

    onlyNumeros = onlyNumbers;
    error: boolean = false;
    errorMessage!: string;
    value: string = '';

    allowOnlyNumbers(event: KeyboardEvent): void {
        const char = String.fromCharCode(event.charCode);
        if (!this.onlyNumeros(char)) {
            event.preventDefault();
            this.error = true;
            this.errorMessage = 'Solo se permiten números.';
            return;
        }
        this.errorMessage = '';
        this.error = false;
    }

    allowLength(
        event: KeyboardEvent, 
        input: HTMLInputElement
    ): void {
        const numero = parseFloat(`${input.value}${event.key}`);
        if(numero < this.min){
            input.value = this.min.toString();
            this.errorMessage = `El valor mínimo es ${this.min}`;
            event.preventDefault();
            return;
        }

        if(numero > this.max){
            input.value = numero.toString().slice(0, -1);
            this.error = true;
            this.errorMessage = `El valor máximo es ${this.max}`;
            event.preventDefault();
            return;
        }
        this.error = false;
    }
}

