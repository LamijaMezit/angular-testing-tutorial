import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { LoginInformacije } from '../_helpers/login-informacije';
import { AutentifikacijaHelper } from '../_helpers/autentifikacija-helper';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return login information', () => {
    const mockLoginInfo: LoginInformacije = {
      autentifikacijaToken: undefined,
      isLogiran: false,
    };

    spyOn(AutentifikacijaHelper, 'getLoginInfo').and.returnValue(mockLoginInfo);

    const result = component.loginInfo();

    expect(result).toEqual(mockLoginInfo);
  });
});
