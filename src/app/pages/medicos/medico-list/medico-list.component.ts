import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MedicoService } from '../../../core/medico/medico.service';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.css']
})
export class MedicoListComponent implements OnInit {
  medicos: Medico[] = [];
  isLoading = true;

  constructor(private medicoService: MedicoService, private router: Router) {}

  ngOnInit() {
    this.carregarMedicos();
  }

  carregarMedicos() {
    this.isLoading = true;
    this.medicoService.listar().subscribe({
      next: (res) => {
        this.medicos = res.content || res; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  excluirMedico(id: number | undefined) {
    if(!id) return;
    if(confirm('Tem certeza que deseja excluir este médico?')) {
      this.medicoService.excluir(id).subscribe({
        next: () => {
          this.carregarMedicos();
        },
        error: (err) => console.error(err)
      });
    }
  }

  editarMedico(id: number | undefined) {
    if(id) {
      this.router.navigate(['/dashboard/medicos/editar', id]);
    }
  }
}
