import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldoFinal: number;
  variacoes: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
}

export interface DadosResumo {
  resumoFinanceiro: ResumoFinanceiro;
  maioresDespesas: {
    nome: string;
    valor: number;
  }[];
  categoriasPrincipais: {
    categoria: string;
    percentual: number;
  }[];
  metasFinanceiras: {
    nome: string;
    percentual: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private apiUrl = 'http://localhost:3001/api/report'

  constructor(private http: HttpClient) { }

  getStats(): Observable<DadosResumo> {
    return this.http.get<DadosResumo>(this.apiUrl + '/stats');
  }

  getResumoIA(): Observable<{ resumeIA: string }> {
    return this.http.get<{ resumeIA: string }>(this.apiUrl + '/resume-ia');
  }
}
