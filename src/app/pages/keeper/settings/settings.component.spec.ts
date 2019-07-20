import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SettingsComponent } from './settings.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElectronService,NgxElectronModule } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
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
  it('should have a title', () => {
    const container = fixture.debugElement.nativeElement;
    expect(container.querySelector('mat-card-title').textContent).toContain("Settings");
  });
  it('should have expansion panel actions', () => {
    const container = fixture.debugElement.queryAll(By.css('mat-expansion-panel')).length;
    const sections = fixture.componentInstance.accordions.length;
    const elementExist: boolean = (container === sections) ? true : false;
    expect(elementExist).toBe(true);
  });
});
