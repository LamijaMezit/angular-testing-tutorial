import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AutentifikacijaHelper } from '../_helpers/autentifikacija-helper';
import { of } from 'rxjs';
import { MojConfig } from '../moj-config';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  function porukaError(a: string): any {
    return 'error';
  }
  function porukaSuccess(a: string): any {
    return 'success';
  }

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

  describe('Login Functionality', () => {
    it('should send login request and navigate to "/studenti" on successful login', () => {
      const mockLoginInfo = { isLogiran: true };
      spyOn(window as any, 'porukaSuccess');
      spyOn(AutentifikacijaHelper, 'setLoginInfo');

      component.txtKorisnickoIme = 'test_username';
      component.txtLozinka = 'test_password';

      component.btnLogin();

      const req = httpTestingController.expectOne(
        `${MojConfig.adresa_servera}/Autentifikacija/Login/`
      );
      expect(req.request.method).toEqual('POST');
      req.flush(mockLoginInfo);

      expect((window as any).porukaSuccess).toHaveBeenCalledWith(
        'uspjesan login'
      );
      expect(AutentifikacijaHelper.setLoginInfo).toHaveBeenCalledWith(
        mockLoginInfo as any
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/studenti');
    });

    it('should display error message on unsuccessful login', () => {
      const mockLoginInfo = { isLogiran: false };
      spyOn(window as any, 'porukaError');
      spyOn(AutentifikacijaHelper, 'setLoginInfo');

      component.txtKorisnickoIme = 'test_username';
      component.txtLozinka = 'test_password';

      component.btnLogin();

      const req = httpTestingController.expectOne(
        `${MojConfig.adresa_servera}/Autentifikacija/Login/`
      );
      expect(req.request.method).toEqual('POST');
      req.flush(mockLoginInfo);

      expect((window as any).porukaError).toHaveBeenCalledWith(
        'neispravan login'
      );
      expect(AutentifikacijaHelper.setLoginInfo).toHaveBeenCalledWith(null);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
