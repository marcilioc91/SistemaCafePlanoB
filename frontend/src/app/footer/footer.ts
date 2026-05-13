import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIcon, CommonModule, MatBadgeModule, MatAnchor],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  @Input() itensNoCarrinho: number = 0;

  @Output() aoAbrirCarrinho = new EventEmitter<void>();

  finalizarClick() {
    this.aoAbrirCarrinho.emit();
  }
}
