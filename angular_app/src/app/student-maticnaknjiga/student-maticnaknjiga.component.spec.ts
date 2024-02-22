import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { StudentMaticnaknjigaComponent } from './student-maticnaknjiga.component';
import { MojConfig } from '../moj-config';

describe('StudentMaticnaknjigaComponent', () => {
  let component: StudentMaticnaknjigaComponent;
  let fixture: ComponentFixture<StudentMaticnaknjigaComponent>;
  let httpTestingController: HttpTestingController;
  let activatedRouteStub: Partial<ActivatedRoute>;

  function porukaError(a: string): any {
    return 'error';
  }
  function porukaSuccess(a: string): any {
    return 'success';
  }

  beforeEach(async(() => {
    activatedRouteStub = {
      params: of({ id: 1 }),
    };

    TestBed.configureTestingModule({
      declarations: [StudentMaticnaknjigaComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMaticnaknjigaComponent);
    component = fixture.componentInstance;
    (window as any).porukaError = porukaError;
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

  describe('Methods', () => {
    it('should create semestar object for ZimskiSemestar', () => {
      component.id = 1;
      component.ZimskiSemestar();
      expect(component.semestar).toEqual({
        id: 1,
        datum: jasmine.any(Date),
        akGodina: 1,
        godinaStudija: 1,
        cijenaSkolarine: 1800,
        obnova: false,
      });
    });

    it('should send request to ovjeri zimski semestar', () => {
      spyOn(window as any, 'porukaSuccess');
      const id = 1;
      component.ovjeriZimski(id);
      const req = httpTestingController.expectOne(
        `${MojConfig.adresa_servera}/MaticnaKnjiga/OvjeriZimski/${id}`
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
      expect((window as any).porukaSuccess).toHaveBeenCalledWith(
        'Uspjesno ovjeren semestar'
      );
    });

    it('should send request to upisi zimski semestar', () => {
      spyOn(window as any, 'porukaSuccess');
      component.semestar = {
        id: 1,
        datum: new Date(),
        akGodina: 1,
        godinaStudija: 1,
        cijenaSkolarine: 1800,
        obnova: false,
      };
      component.upisiZimski();
      const req = httpTestingController.expectOne(
        `${MojConfig.adresa_servera}/MaticnaKnjiga/UpisiZimski/${component.id}`
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
      expect((window as any).porukaSuccess).toHaveBeenCalledWith(
        'Uspjesno upisan semestar'
      );
      expect(component.semestar).toBeNull();
    });
  });
});
