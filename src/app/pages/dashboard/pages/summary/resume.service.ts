import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private apiUrl = 'http://localhost:3001/api/report/resume'

  constructor(private http: HttpClient) {}

  getResumo(): Observable<{ totalReceitas: number, totalDespesas: number, saldo: number }> {
    return this.http.get<{ resume: any }>(this.apiUrl)
      .pipe(
        map(res => ({
          totalReceitas: res.resume.totalReceita,
          totalDespesas: res.resume.totalDespesa,
          saldo: res.resume.saldoFinal
        }))
      );
  }

  getResumoIA(): Observable<{ resumeIA: string }> {
    return this.http.get(this.apiUrl + '/ia', { responseType: 'text' }).pipe(
      map((response: string) => {
        const parsed = JSON.parse(response);
        return { resumeIA: parsed.resume };
      })
    );
  }
  
}
