import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicoService } from '../../../core/medico/medico.service';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-medico-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medico-form.component.html',
  styleUrls: ['./medico-form.component.css']
})
export class MedicoFormComponent implements OnInit {
  medico: Medico = {
    nome: '', email: '', telefone: '', crm: '', especialidade: '',
    endereco: { logradouro: '', bairro: '', cep: '', cidade: '', uf: '', numero: '', complemento: '' }
  };
  isLoading = false;
  isEdicao = false;

  constructor(
    private medicoService: MedicoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.carregarMedico(Number(id));
    }
  }

  carregarMedico(id: number) {
    this.isLoading = true;
    this.medicoService.buscarPorId(id).subscribe({
      next: (res) => {
        this.medico = res;
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
      ? this.medicoService.atualizar(this.medico)
      : this.medicoService.cadastrar(this.medico);

    requisicao.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/medicos']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Erro ao salvar os dados.');
      }
    });
  }
}
