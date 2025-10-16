import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TopOrigin {
  name: string;
  count: number;
}

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.css',
})
export class StatsGridComponent {
  @Input() totalTastings: number = 0;
  @Input() topOrigins: TopOrigin[] = [];
  @Input() favoriteRoast: string = '';
  @Input() favoriteBrewMethod: string = '';
  @Input() tastingTrend: string = '';
}
