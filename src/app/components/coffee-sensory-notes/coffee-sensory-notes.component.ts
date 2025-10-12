import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coffee-roast-slide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-sensory-notes.component.html',
  styleUrls: ['./coffee-sensory-notes.component.css'],
})
export class CoffeeSensoryNotesComponent {
  formSubmit = output<void>();
  onSubmit() {
    this.formSubmit.emit();
  }
}
