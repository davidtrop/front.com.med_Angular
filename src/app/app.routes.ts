import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MedicoListComponent } from './pages/medicos/medico-list/medico-list.component';
import { MedicoFormComponent } from './pages/medicos/medico-form/medico-form.component';
import { PacienteListComponent } from './pages/pacientes/paciente-list/paciente-list.component';
import { PacienteFormComponent } from './pages/pacientes/paciente-form/paciente-form.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'medicos', component: MedicoListComponent },
      { path: 'medicos/novo', component: MedicoFormComponent },
      { path: 'medicos/editar/:id', component: MedicoFormComponent },

      { path: 'pacientes', component: PacienteListComponent },
      { path: 'pacientes/novo', component: PacienteFormComponent },
      { path: 'pacientes/editar/:id', component: PacienteFormComponent },

      { path: 'consultas', component: ConsultasComponent },

      { path: '', redirectTo: 'medicos', pathMatch: 'full' },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
