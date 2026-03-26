import { Component } from '@angular/core';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-form',
  imports: [FormsModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm {
  produto: Produto = {
    id: 0,
    nome: '',
    preco: 0,
    estoque: 0
  }

  constructor(private service: ProdutoService){}

  salvar(){
    this.service.salvar(this.produto).subscribe(() => {
      alert("Produto salvo!")
    })
  }
}
