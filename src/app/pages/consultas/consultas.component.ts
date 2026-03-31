import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultaService } from '../../core/consulta/consulta.service';
import { MedicoService } from '../../core/medico/medico.service';
import { PacienteService } from '../../core/paciente/paciente.service';
import { Medico } from '../../core/models/medico.model';
import { Paciente } from '../../core/models/paciente.model';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  medicos: Medico[] = [];
  pacientes: Paciente[] = [];

  agendamento = {
    idMedico: null,
    idPaciente: null,
    data: ''
  };

  cancelamento = {
    idConsulta: null,
    motivoCancelamento: ''
  };

  isLoadingA = false;
  isLoadingC = false;

  constructor(
    private consultaService: ConsultaService,
    private medicoService: MedicoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit() {
    this.medicoService.listar().subscribe((res: any) => this.medicos = res.content || res);
    this.pacienteService.listar().subscribe((res: any) => this.pacientes = res.content || res);
  }

  agendar() {
    this.isLoadingA = true;
    
    // Convert current local datetime input to ISO format for Spring Boot
    const dateObj = new Date(this.agendamento.data);
    const isoDate = dateObj.toISOString().split('.')[0]; // remove ms to avoid spring parsing issues depending on format

    const consulta = {
      idMedico: this.agendamento.idMedico || undefined,
      idPaciente: this.agendamento.idPaciente || undefined,
      data: this.agendamento.data // Backend might expect specific format, usually "yyyy-MM-ddTHH:mm" for LocalDateTime
    };
    
    this.consultaService.agendar(consulta).subscribe({
      next: (res: any) => {
        alert('Consulta agendada com sucesso! ID: ' + res.id);
        this.isLoadingA = false;
        this.agendamento = { idMedico: null, idPaciente: null, data: '' };
      },
      error: (err: any) => {
        alert('Erro ao agendar consulta: ' + (err.error?.message || err.message));
        this.isLoadingA = false;
      }
    });
  }

  cancelar() {
    if(!this.cancelamento.idConsulta || !this.cancelamento.motivoCancelamento) return;
    this.isLoadingC = true;
    this.consultaService.cancelar(this.cancelamento.idConsulta, this.cancelamento.motivoCancelamento).subscribe({
      next: () => {
        alert('Consulta cancelada com sucesso!');
        this.isLoadingC = false;
        this.cancelamento = { idConsulta: null, motivoCancelamento: '' };
      },
      error: (err: any) => {
        alert('Erro ao cancelar consulta.');
        this.isLoadingC = false;
      }
    });
  }
}
