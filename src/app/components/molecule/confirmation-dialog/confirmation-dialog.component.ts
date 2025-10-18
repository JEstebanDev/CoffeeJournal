import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../services/language/translate.pipe';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  @Input() isVisible = signal(false);
  @Input() title = signal('confirmationTitle');
  @Input() message = signal('confirmationMessage');
  @Input() details = signal<string | null>(null);
  @Input() confirmText = signal('confirmButton');
  @Input() cancelText = signal('cancelButton');

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
