import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

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
    @Input() required: boolean = false;

    error: boolean = false;
    errorMessage: string = '';
    value: string = '';

    /**
     * Handles the (input) event — works reliably on mobile and desktop.
     * Strips non-numeric characters (except one decimal point),
     * then enforces min/max.
     */
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let raw = input.value;

        // Allow only digits and a single decimal point
        raw = raw.replace(/[^0-9.]/g, '');

        // Remove extra decimal points (keep only the first)
        const parts = raw.split('.');
        if (parts.length > 2) {
            raw = parts[0] + '.' + parts.slice(1).join('');
        }

        const numero = parseFloat(raw);

        if (!isNaN(numero) && numero > this.max) {
            raw = this.max.toString();
            this.error = true;
            this.errorMessage = `Máximo ${this.max}`;
        } else if (!isNaN(numero) && numero < 0) {
            raw = '';
            this.error = true;
            this.errorMessage = `Mínimo ${this.min}`;
        } else {
            // Clear error as soon as user types valid input
            this.error = false;
            this.errorMessage = '';
        }

        // Sync value & DOM
        this.value = raw;
        input.value = raw;
    }

    /** Called externally to mark this field as invalid (e.g. when empty on submit) */
    markError(message: string): void {
        this.error = true;
        this.errorMessage = message;
    }

    /** Clears the error state */
    clearError(): void {
        this.error = false;
        this.errorMessage = '';
    }

    /** Returns true if the field has a valid numeric value */
    isValid(): boolean {
        const num = Number(this.value);
        return this.value.trim() !== '' && !isNaN(num) && num > 0;
    }
}
