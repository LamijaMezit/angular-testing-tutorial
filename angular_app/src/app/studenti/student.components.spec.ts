import { TestBed, async } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StudentiComponent } from './studenti.component';
import { MojConfig } from '../moj-config';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('StudentiComponent', () => {
  let component: StudentiComponent;
  let httpTestingController: HttpTestingController;

  function porukaSuccess(a: string): any {
    return 'success';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentiComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(StudentiComponent);
    component = fixture.componentInstance;
    (window as any).porukaSuccess = porukaSuccess;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Fetching Data', () => {
    it('should fetch student data successfully', () => {
      const mockStudentData = [{ id: 1, name: 'Lamija' }];

      component.fetchStudenti();

      const req = httpTestingController.expectOne(
        MojConfig.adresa_servera + '/Student/GetAll'
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockStudentData);

      expect(component.studentPodaci).toEqual(mockStudentData);
    });

    it('should fetch opstine data successfully', () => {
      const mockOpstineData = [
        { id: 1, name: 'Opstina1' },
        { id: 2, name: 'Opstina2' },
      ];

      component.fetchOpstine();

      const req = httpTestingController.expectOne(
        MojConfig.adresa_servera + '/Opstina/GetByAll'
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockOpstineData);

      expect(component.opstinaPodaci).toEqual(mockOpstineData);
    });

    it('should call fetchStudenti and fetchOpstine on component initialization', () => {
      spyOn(component, 'fetchStudenti');
      spyOn(component, 'fetchOpstine');

      component.ngOnInit();

      expect(component.fetchStudenti).toHaveBeenCalled();
      expect(component.fetchOpstine).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to "student-maticnaknjiga" page with correct student ID', () => {
      const routerSpy = spyOn((component as any).router, 'navigate');
      const s = { id: 1 };

      component.OtvoriMaticnu(s);

      expect(routerSpy).toHaveBeenCalledWith(['student-maticnaknjiga', s.id]);
    });
  });

  describe('Filtering', () => {
    it('should return filtered student data when input parameters are provided', () => {
      component.studentPodaci = [
        {
          id: 1,
          ime: 'Lamija',
          prezime: 'Mezit',
          opstina_rodjenja: { description: 'Opstina1' },
        },
      ];
      component.filter_ime_prezime = true;
      component.filter_opstina = true;
      component.ime_prezime = 'Lamija';
      component.opstina = 'Opstina1';

      const result = component.Filtriraj();

      expect(result).toEqual([
        {
          id: 1,
          ime: 'Lamija',
          prezime: 'Mezit',
          opstina_rodjenja: { description: 'Opstina1' },
        },
      ]);
    });
  });

  describe('CRUD Operations', () => {
    it('should send soft delete request and display success message', () => {
      const mockStudent = { id: 1 };

      spyOn(window as any, 'porukaSuccess').and.callThrough();

      component.Obrisi(mockStudent);

      const req = httpTestingController.expectOne(
        MojConfig.adresa_servera + '/Student/SoftDelete/1'
      );
      expect(req.request.method).toEqual('POST');

      req.flush({});

      expect((window as any).porukaSuccess).toHaveBeenCalledWith(
        'Uspjesna radnja'
      );
    });

    it('should set the selected student as odabraniStudent', () => {
      const component = new StudentiComponent(null, null);
      const student = { id: 1, name: 'Lamija Mezit' };
      component.UrediStudenta(student);
      expect(component.odabraniStudent).toEqual(student);
    });

    it('should create a new student object with id=0', () => {
      const component = new StudentiComponent(null, null);
      component.ime_prezime = 'Lamija Mezit';
      component.DodajNovogStudenta();
      expect(component.odabraniStudent).toEqual({
        id: 0,
        ime: 'Lamija Mezit',
        prezime: '',
        opstina_rodjenja_id: 2,
        name: 'Uredi studenta',
      });
    });

    it('should send update request and display success message', () => {
      const mockStudent = { id: 1, name: 'Lamija' }; // Mock student data
      component.odabraniStudent = mockStudent;

      spyOn(window as any, 'porukaSuccess');

      component.SpasiPromjene();

      const req = httpTestingController.expectOne(
        MojConfig.adresa_servera + '/Student/Update/1'
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockStudent);

      req.flush({});

      expect((window as any).porukaSuccess).toHaveBeenCalledWith(
        'Uspjesna radnja'
      );
    });
  });
});
