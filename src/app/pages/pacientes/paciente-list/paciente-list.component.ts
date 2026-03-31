import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/paciente/paciente.service';
import { Paciente } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = true;

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
    if(confirm('Tem certeza que deseja excluir este paciente?')) {
      this.pacienteService.excluir(id).subscribe({
        next: () => {
          this.carregarPacientes();
        },
        error: (err) => console.error(err)
      });
    }
  }

  editarPaciente(id: number | undefined) {
    if(id) {
      this.router.navigate(['/dashboard/pacientes/editar', id]);
    }
  }
}
