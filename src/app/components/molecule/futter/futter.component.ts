import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '../../../services/language/translate.pipe';

@Component({
  selector: 'app-futter',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './futter.component.html',
  styleUrls: ['./futter.component.css'],
})
export class FutterComponent {}
