import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ title() }}</h3>
          <button class="close-button" (click)="onCancel()" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="dialog-content">
          <p class="dialog-message">{{ message() }}</p>
          @if (details()) {
          <p class="dialog-details">{{ details() }}</p>
          }
        </div>

        <div class="dialog-actions">
          <button class="btn btn-secondary" (click)="onCancel()" type="button">
            {{ cancelText() }}
          </button>
          <button class="btn btn-primary" (click)="onConfirm()" type="button">
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        backdrop-filter: blur(4px);
        min-height: 100vh;
        min-height: 100dvh; /* Dynamic viewport height for mobile */
      }

      .dialog-container {
        background: #1f2937;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
        max-width: 420px;
        width: calc(100% - 2rem);
        max-height: 90vh;
        max-height: 90dvh; /* Dynamic viewport height for mobile */
        overflow-y: auto;
        border: 1px solid #374151;
        animation: popup 0.2s ease-out;
        margin: auto;
        position: relative;
      }

      @keyframes popup {
        0% {
          opacity: 0;
          transform: scale(0.9) translateY(-10px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1.5rem 0 1.5rem;
      }

      .dialog-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #f9fafb;
      }

      .close-button {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        border-radius: 8px;
        color: #9ca3af;
        transition: all 0.2s;
      }

      .close-button:hover {
        background-color: #374151;
        color: #f3f4f6;
      }

      .close-button svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .dialog-content {
        padding: 1rem 1.5rem;
      }

      .dialog-message {
        margin: 0 0 0.5rem 0;
        color: #e5e7eb;
        line-height: 1.5;
      }

      .dialog-details {
        margin: 0;
        color: #9ca3af;
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .dialog-actions {
        display: flex;
        gap: 0.75rem;
        padding: 0 1.5rem 1.5rem 1.5rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid;
        min-width: 100px;
      }

      .btn-secondary {
        background-color: transparent;
        color: #e5e7eb;
        border-color: #6b7280;
      }

      .btn-secondary:hover {
        background-color: rgba(107, 114, 128, 0.1);
        border-color: #9ca3af;
        color: #f3f4f6;
      }

      .btn-primary {
        background-color: #dc2626;
        color: white;
        border-color: #dc2626;
      }

      .btn-primary:hover {
        background-color: #b91c1c;
        border-color: #b91c1c;
      }

      .btn:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .dialog-overlay {
          padding: 0.5rem;
        }

        .dialog-container {
          width: calc(100% - 1rem);
          max-width: none;
          margin: 0;
        }

        .dialog-header {
          padding: 1rem 1rem 0 1rem;
        }

        .dialog-content {
          padding: 0.75rem 1rem;
        }

        .dialog-actions {
          padding: 0 1rem 1rem 1rem;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn {
          width: 100%;
          min-width: auto;
        }
      }

      /* Small mobile devices */
      @media (max-width: 480px) {
        .dialog-overlay {
          padding: 0.25rem;
        }

        .dialog-container {
          width: calc(100% - 0.5rem);
          border-radius: 12px;
        }

        .dialog-title {
          font-size: 1.125rem;
        }

        .dialog-message {
          font-size: 0.875rem;
        }
      }

      /* Landscape mobile */
      @media (max-height: 500px) and (orientation: landscape) {
        .dialog-overlay {
          align-items: flex-start;
          padding-top: 1rem;
        }

        .dialog-container {
          max-height: 95vh;
          max-height: 95dvh;
        }
      }
    `,
  ],
})
export class ConfirmationDialogComponent {
  @Input() isVisible = signal(false);
  @Input() title = signal('Confirmar acción');
  @Input() message = signal('¿Estás seguro de que quieres continuar?');
  @Input() details = signal<string | null>(null);
  @Input() confirmText = signal('Confirmar');
  @Input() cancelText = signal('Cancelar');

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
