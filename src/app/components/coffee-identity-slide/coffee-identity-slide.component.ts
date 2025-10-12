import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CoffeeIdentity {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
}

@Component({
  selector: 'app-coffee-identity-slide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-identity-slide.component.html',
  styleUrls: ['./coffee-identity-slide.component.css'],
})
export class CoffeeIdentitySlideComponent {
  // Inputs
  coffeeData = input.required<CoffeeIdentity>();
  beanTypes = input.required<string[]>();

  // Outputs
  dataChange = output<Partial<CoffeeIdentity>>();

  updateField(field: keyof CoffeeIdentity, value: string) {
    this.dataChange.emit({ [field]: value });
  }
}
