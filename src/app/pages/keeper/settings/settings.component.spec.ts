import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElectronService,NgxElectronModule } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MatSnackBarModule } from '@angular/material';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        NgxElectronModule,
        MatSnackBarModule
      ],
      declarations: [ SettingsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ThemeService,
        { provide: ElectronService, useClass: FakeElectronService }
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
