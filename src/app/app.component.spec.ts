import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeService } from 'src/app/services/theme.service';
import { MatSnackBarModule } from '@angular/material';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';

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
        ThemeService, 
        { provide: ElectronService, useClass: FakeElectronService }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
