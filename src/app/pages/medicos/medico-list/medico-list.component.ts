import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MedicoService } from '../../../core/medico/medico.service';
import { Medico } from '../../../core/models/medico.model';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.css']
})
export class MedicoListComponent implements OnInit {
  medicos: Medico[] = [];
  isLoading = true;
  showConfirmModal = false;
  medicoToDelete: number | null = null;

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
    this.medicoToDelete = id;
    this.showConfirmModal = true;
  }

  confirmarExclusao() {
    if(this.medicoToDelete) {
      this.medicoService.excluir(this.medicoToDelete).subscribe({
        next: () => {
          this.showConfirmModal = false;
          this.medicoToDelete = null;
          this.carregarMedicos();
        },
        error: (err) => {
          console.error(err);
          this.showConfirmModal = false;
          this.medicoToDelete = null;
        }
      });
    }
  }

  cancelarExclusao() {
    this.showConfirmModal = false;
    this.medicoToDelete = null;
  }

  editarMedico(id: number | undefined) {
    if(id) {
      this.router.navigate(['/dashboard/medicos/editar', id]);
    }
  }
}
