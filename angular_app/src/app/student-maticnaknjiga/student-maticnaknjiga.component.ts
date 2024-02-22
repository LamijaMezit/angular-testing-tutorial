import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MojConfig } from '../moj-config';
import { HttpClient } from '@angular/common/http';

declare function porukaSuccess(a: string): any;
declare function porukaError(a: string): any;

@Component({
  selector: 'app-student-maticnaknjiga',
  templateUrl: './student-maticnaknjiga.component.html',
  styleUrls: ['./student-maticnaknjiga.component.css'],
})
export class StudentMaticnaknjigaComponent implements OnInit {
  maticnaKnjiga: any;
  godine: any;
  sub: any;
  id: any;
  semestar: any;
  upisi: any;

  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadGodine();
    this.sub = this.route.params.subscribe((res: any) => {
      this.id = +res['id'];
      this.loadMaticna();
    });
  }

  loadMaticna() {
    this.httpKlijent
      .get(
        MojConfig.adresa_servera + '/MaticnaKnjiga/GetMaticna?id=' + this.id,
        MojConfig.http_opcije()
      )
      .subscribe((x) => {
        this.maticnaKnjiga = x;
      });
  }

  loadGodine() {
    this.httpKlijent
      .get(
        MojConfig.adresa_servera + '/MaticnaKnjiga/GetGodine',
        MojConfig.http_opcije()
      )
      .subscribe((x) => {
        this.godine = x;
      });
  }

  ZimskiSemestar() {
    this.semestar = {
      id: this.id,
      datum: new Date(),
      akGodina: 1,
      godinaStudija: 1,
      cijenaSkolarine: 1800,
      obnova: false,
    };
  }
  ovjeriZimski(s: any) {
    this.httpKlijent
      .post(
        MojConfig.adresa_servera + '/MaticnaKnjiga/OvjeriZimski/' + s,
        MojConfig.http_opcije()
      )
      .subscribe((x) => {
        porukaSuccess('Uspjesno ovjeren semestar');
      });
  }

  upisiZimski() {
    this.httpKlijent
      .post(
        MojConfig.adresa_servera + '/MaticnaKnjiga/UpisiZimski/' + this.id,
        this.semestar,
        MojConfig.http_opcije()
      )
      .subscribe((x) => {
        porukaSuccess('Uspjesno upisan semestar');
        this.semestar = null;
      });
  }
}
