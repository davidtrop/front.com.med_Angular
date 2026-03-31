import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/paciente/paciente.service';
import { Paciente } from '../../../core/models/paciente.model';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = true;
  showConfirmModal = false;
  pacienteToDelete: number | null = null;

  constructor(private pacienteService: PacienteService, private router: Router) {}

  ngOnInit() {
    this.carregarPacientes();
  }

  carregarPacientes() {
    this.isLoading = true;
    this.pacienteService.listar().subscribe({
      next: (res) => {
        this.pacientes = res.content || res; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  excluirPaciente(id: number | undefined) {
    if(!id) return;
    this.pacienteToDelete = id;
    this.showConfirmModal = true;
  }

  confirmarExclusao() {
    if(this.pacienteToDelete) {
      this.pacienteService.excluir(this.pacienteToDelete).subscribe({
        next: () => {
          this.showConfirmModal = false;
          this.pacienteToDelete = null;
          this.carregarPacientes();
        },
        error: (err) => {
          console.error(err);
          this.showConfirmModal = false;
          this.pacienteToDelete = null;
        }
      });
    }
  }

  cancelarExclusao() {
    this.showConfirmModal = false;
    this.pacienteToDelete = null;
  }

  editarPaciente(id: number | undefined) {
    if(id) {
      this.router.navigate(['/dashboard/pacientes/editar', id]);
    }
  }
}
