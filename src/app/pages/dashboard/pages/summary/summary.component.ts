import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from './resume.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  totalReceita: number = 0;
  totalDespesa: number = 0;
  saldo: number = 0;
  loading: boolean = false;
  resumoIA: string = '';

  // Variações (tendências)
  receitaTendencia: number = 0;
  despesaTendencia: number = 0;
  saldoTendencia: number = 0;

  maioresDespesas: { nome: string; valor: number }[] = [];
  categoriasPrincipais: { categoria: string; percentual: number }[] = [];
  metasFinanceiras: { nome: string; percentual: number }[] = [];

  constructor(private resumeService: ResumeService) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.resumeService.getStats().subscribe({
      next: (data) => {
        // Dados do resumo financeiro
        this.totalReceita = data.resumoFinanceiro.totalReceitas;
        this.totalDespesa = data.resumoFinanceiro.totalDespesas;
        this.saldo = data.resumoFinanceiro.saldoFinal;

        // Variações
        this.receitaTendencia = data.resumoFinanceiro.variacoes.receitas;
        this.despesaTendencia = data.resumoFinanceiro.variacoes.despesas;
        this.saldoTendencia = data.resumoFinanceiro.variacoes.saldo;

        // Outras estatísticas
        this.maioresDespesas = data.maioresDespesas;
        this.categoriasPrincipais = data.categoriasPrincipais;
        this.metasFinanceiras = data.metasFinanceiras;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      }
    });
  }

  async gerarResumoIA() {
    this.loading = true;
    this.resumeService.getResumoIA().subscribe({
      next: (data: any) => {
        this.resumoIA = data.resume;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao gerar resumo:', error);
        this.resumoIA = 'Desculpe, não foi possível gerar o resumo no momento.';
        this.loading = false;
      }
    });
  }
}
