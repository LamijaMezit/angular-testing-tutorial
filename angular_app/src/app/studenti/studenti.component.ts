import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-studenti',
  templateUrl: './studenti.component.html',
  styleUrls: ['./studenti.component.css']
})
export class StudentiComponent implements OnInit {

  title:string = 'angularFIT2';
  ime_prezime:string = '';
  opstina: string = '';
  studentPodaci: any;
  filter_ime_prezime: boolean;
  filter_opstina: boolean;

  opstinaPodaci:any;
  odabraniStudent:any;


  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  fetchStudenti() :void
  {
    this.httpKlijent.get(MojConfig.adresa_servera+ "/Student/GetAll", MojConfig.http_opcije()).subscribe(x=>{
      this.studentPodaci = x;
    });
  }
  fetchOpstine() :void
  {
    this.httpKlijent.get(MojConfig.adresa_servera+ "/Opstina/GetByAll", MojConfig.http_opcije()).subscribe(x=>{
      this.opstinaPodaci = x;
    });
  }
  ngOnInit(): void {
    this.fetchStudenti();
    this.fetchOpstine();
  }

  OtvoriMaticnu(s:any)
  {
    this.router.navigate(['student-maticnaknjiga', s.id]);
  }

  Filtriraj()
  {
    if(this.studentPodaci==null)
    return [];

    return this.studentPodaci.filter((a:any)=>
    (!this.filter_ime_prezime ||
      (a.ime + " " + a.prezime).startsWith(this.ime_prezime) ||
      (a.prezime + " " + a.ime).startsWith(this.ime_prezime))

      &&
      (!this.filter_opstina ||
        (a.opstina_rodjenja != null && a.opstina_rodjenja.description).startsWith(this.opstina))
    );
  }

  Obrisi(s:any)
  {
    this.httpKlijent.post(MojConfig.adresa_servera+ "/Student/SoftDelete/" + s.id, MojConfig.http_opcije()).subscribe(x=>{
      porukaSuccess("Uspjesna radnja");
    });

  }

  UrediStudenta(s:any)
  {
    this.odabraniStudent=s;
    this.odabraniStudent.name="Uredi studenta";
  }
  DodajNovogStudenta()
  {
    this.odabraniStudent=
    {
      id:0,
      ime:this.ime_prezime,
      prezime:"",
      opstina_rodjenja_id:2,
      name:"Uredi studenta"
    }
  }

  SpasiPromjene()
  {
    this.httpKlijent.post(MojConfig.adresa_servera+ "/Student/Update/" + this.odabraniStudent.id, this.odabraniStudent, MojConfig.http_opcije()).subscribe(x=>{
      porukaSuccess("Uspjesna radnja");
    });
  }

}
