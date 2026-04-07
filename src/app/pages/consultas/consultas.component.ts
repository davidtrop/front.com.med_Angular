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
  consultas: any[] = [];

  // Variáveis do Modal
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';

  get minDate(): string {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
  }

  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  constructor(
    private consultaService: ConsultaService,
    private medicoService: MedicoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit() {
    this.medicoService.listar().subscribe((res: any) => this.medicos = res.content || res);
    this.pacienteService.listar().subscribe((res: any) => this.pacientes = res.content || res);
    this.carregarConsultas();
  }

  carregarConsultas() {
    this.consultaService.listar().subscribe({
      next: (res: any) => {
        this.consultas = res.content || res;
      },
      error: (err: any) => {
        console.error('Erro ao carregar consultas', err);
      }
    });
  }

  agendar() {
    this.isLoadingA = true;
    
    let formattedData = '';
    if (this.agendamento.data) {
      const dateObj = new Date(this.agendamento.data);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      formattedData = `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const consulta = {
      idMedico: this.agendamento.idMedico || undefined,
      idPaciente: this.agendamento.idPaciente || undefined,
      data: formattedData
    };
    
    this.consultaService.agendar(consulta).subscribe({
      next: (res: any) => {
        this.openModal('Sucesso', 'Consulta agendada com sucesso! ID: ' + res.id);
        this.isLoadingA = false;
        this.agendamento = { idMedico: null, idPaciente: null, data: '' };
        this.carregarConsultas();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || err.message || 'Erro desconhecido.';
        this.openModal('Erro', 'Erro ao agendar consulta: ' + errorMsg);
        this.isLoadingA = false;
      }
    });
  }

  cancelar() {
    if(!this.cancelamento.idConsulta || !this.cancelamento.motivoCancelamento) return;
    this.isLoadingC = true;
    this.consultaService.cancelar(this.cancelamento.idConsulta, this.cancelamento.motivoCancelamento).subscribe({
      next: () => {
        this.openModal('Sucesso', 'Consulta cancelada com sucesso!');
        this.isLoadingC = false;
        this.cancelamento = { idConsulta: null, motivoCancelamento: '' };
        this.carregarConsultas();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || err.message || 'Erro desconhecido.';
        this.openModal('Erro', 'Erro ao cancelar consulta: ' + errorMsg);
        this.isLoadingC = false;
      }
    });
  }
}
