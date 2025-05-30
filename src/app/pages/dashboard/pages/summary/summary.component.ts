import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from './resume.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  totalReceita = 0;
  totalDespesa = 0;
  saldo = 0;
  resumoIA = '';
  loading = false;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo() {
    this.resumeService.getResumo().subscribe({
      next: (res) => {
        this.totalReceita = res.totalReceitas;
        this.totalDespesa = res.totalDespesas;
        this.saldo = res.saldo;
      },
      error: () => {
        alert('Erro ao carregar os dados do resumo.');
      }
    });
  }

  gerarResumoIA() {
    this.loading = true;
    this.resumeService.getResumoIA().subscribe({
      next: (texto) => {
        this.resumoIA = texto.resumeIA;
        this.loading = false;
      },
      error: () => {
        alert('Erro ao gerar resumo por IA.');
        this.loading = false;
      }
    });
  }
}
