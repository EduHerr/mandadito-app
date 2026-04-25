import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  standalone: true,
  selector: 'listname-field',
  templateUrl: './listname-field.component.html',
  styleUrls: ['./listname-field.component.css'],
})
export class ListNameField {
  name = 'Mi Lista';
  editing = false;
  tempName = '';

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  startEdit(): void {
    this.tempName = this.name;
    this.editing = true;

    // wait for render → focus the input
    setTimeout(() => {
      this.nameInput?.nativeElement.focus();
      this.nameInput?.nativeElement.select();
    });
  }

  confirmEdit(): void {
    if (this.tempName.trim() !== '') {
      this.name = this.tempName.trim();
    }
    this.editing = false;
  }

  cancelEdit(): void {
    this.tempName = this.name;
    this.editing = false;
  }

  handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.confirmEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }
}
