import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './gerenciar-usuarios.html',
  styleUrl: './gerenciar-usuarios.css',
})
export class GerenciarUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  carregando = true;
  adminId: number | null = null;
  colunas = ['nome', 'login', 'email', 'perfil', 'acao'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.adminId = this.auth.getUsuarioLogado()?.id ?? null;
    this.auth.listarUsuarios().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.carregando = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  alternarPerfil(usuario: Usuario) {
    const novoPerfil = usuario.perfil === 'ADMIN' ? 'OPERADOR' : 'ADMIN';
    this.auth.atualizarPerfil(usuario.id!, novoPerfil).subscribe({
      next: (atualizado) => {
        usuario.perfil = atualizado.perfil;
        this.cdRef.detectChanges();
      },
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
