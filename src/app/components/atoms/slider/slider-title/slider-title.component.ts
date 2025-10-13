import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-slider-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-title.component.html',
  styleUrls: ['./slider-title.component.css'],
})
export class SliderTitleComponent {
    title = input.required<string>();
    subtitle = input.required<string>();
}
