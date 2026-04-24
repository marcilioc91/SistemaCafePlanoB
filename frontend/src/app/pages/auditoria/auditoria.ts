import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditoriaLog } from '../../models/auditoria';

interface UsuarioOpcao {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class Auditoria implements OnInit {
  todosLogs: AuditoriaLog[] = [];
  logsFiltrados: AuditoriaLog[] = [];
  usuarios: UsuarioOpcao[] = [];
  usuarioSelecionado: number | null = null;
  carregando = true;

  colunas = ['dataHora', 'usuarioNome', 'tipoOperacao', 'descricao'];

  constructor(
    private auditoriaService: AuditoriaService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.auditoriaService.listar().subscribe({
      next: (dados) => {
        this.todosLogs = dados;
        this.logsFiltrados = dados;
        this.extrairUsuarios(dados);
        this.carregando = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  private extrairUsuarios(logs: AuditoriaLog[]) {
    const mapa = new Map<number, string>();
    logs.forEach((l) => {
      if (l.usuarioId && !mapa.has(l.usuarioId)) {
        mapa.set(l.usuarioId, l.usuarioNome);
      }
    });
    this.usuarios = Array.from(mapa.entries()).map(([id, nome]) => ({ id, nome }));
  }

  filtrar() {
    if (!this.usuarioSelecionado) {
      this.logsFiltrados = this.todosLogs;
    } else {
      this.logsFiltrados = this.todosLogs.filter(
        (l) => l.usuarioId === this.usuarioSelecionado
      );
    }
  }

  limparFiltro() {
    this.usuarioSelecionado = null;
    this.logsFiltrados = this.todosLogs;
  }

  labelTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      VENDA: 'Venda',
      INCLUSAO_PRODUTO: 'Incl. Produto',
      ALTERACAO_PRODUTO: 'Alt. Produto',
      EXCLUSAO_PRODUTO: 'Excl. Produto',
      INCLUSAO_CLIENTE: 'Incl. Cliente',
      ALTERACAO_CLIENTE: 'Alt. Cliente',
      EXCLUSAO_CLIENTE: 'Excl. Cliente',
    };
    return mapa[tipo] ?? tipo;
  }

  corTipo(tipo: string): string {
    if (tipo === 'VENDA') return 'venda';
    if (tipo.startsWith('INCLUSAO')) return 'inclusao';
    if (tipo.startsWith('ALTERACAO')) return 'alteracao';
    if (tipo.startsWith('EXCLUSAO')) return 'exclusao';
    return '';
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
