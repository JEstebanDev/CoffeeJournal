import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
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
