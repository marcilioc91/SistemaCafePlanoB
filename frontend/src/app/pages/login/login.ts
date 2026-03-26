import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = {
    cpf: "",
    email: "",
    senha: ""
  }

  constructor(private auth: AuthService) {}
  login(){
    this.auth.login(this.usuario).subscribe(res => {
      console.log("Login realizado com sucesso!", res)
    })
  }
}
