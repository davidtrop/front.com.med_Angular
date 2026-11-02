import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { PacienteService } from '../../../core/paciente/paciente.service';
import { Paciente } from '../../../core/models/paciente.model';
import { PhoneMaskDirective } from '../../../core/directives/phone-mask.directive';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    PhoneMaskDirective
  ],
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css']
})
export class PacienteFormComponent implements OnInit {
  paciente: Paciente = {
    nome: '', email: '', telefone: '', cpf: '',
    endereco: { logradouro: '', bairro: '', cep: '', cidade: '', uf: '', numero: '', complemento: '' }
  };
  isLoading = false;
  isEdicao = false;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.carregarPaciente(Number(id));
    }
  }

  carregarPaciente(id: number) {
    this.isLoading = true;
    this.pacienteService.buscarPorId(id).subscribe({
      next: (res) => {
        this.paciente = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    const requisicao = this.isEdicao 
      ? this.pacienteService.atualizar(this.paciente)
      : this.pacienteService.cadastrar(this.paciente);

    requisicao.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/pacientes']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Erro ao salvar os dados.');
      }
    });
  }
}
