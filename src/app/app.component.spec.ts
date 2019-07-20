import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';

let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        NgxElectronModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ElectronService, useClass: FakeElectronService }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should have the app container', () => {
    const container = fixture.debugElement.query(By.css('#ContainerApp'));
    const elementExist:boolean = container ? true : false;
    expect(elementExist).toBe(true);
  });
  it('should have the app loader', () => {
    const loader = fixture.debugElement.query(By.css('.loader-container'));
    const elementExist: boolean = loader ? true : false;
    expect(elementExist).toBe(true);
  });
});
