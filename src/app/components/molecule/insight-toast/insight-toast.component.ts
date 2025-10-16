import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Insight {
  message: string;
  icon: string;
}

@Component({
  selector: 'app-insight-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insight-toast.component.html',
  styleUrl: './insight-toast.component.css',
})
export class InsightToastComponent implements OnInit, OnDestroy {
  @Input() insights: Insight[] = [];
  @Input() intervalMs: number = 5000; // Cambiar cada 5 segundos

  currentInsight = signal<Insight | null>(null);
  currentIndex = 0;
  private intervalId: any;
  isVisible = signal(false);

  ngOnInit() {
    if (this.insights.length > 0) {
      this.showNextInsight();
      this.startRotation();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startRotation() {
    this.intervalId = setInterval(() => {
      this.showNextInsight();
    }, this.intervalMs);
  }

  private showNextInsight() {
    // Fade out
    this.isVisible.set(false);

    setTimeout(() => {
      // Change insight
      this.currentInsight.set(this.insights[this.currentIndex]);
      this.currentIndex = (this.currentIndex + 1) % this.insights.length;

      // Fade in
      setTimeout(() => {
        this.isVisible.set(true);
      }, 50);
    }, 300);
  }
}
