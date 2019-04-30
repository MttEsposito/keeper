import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        NgxElectronModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      declarations: [SignInComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ElectronService, useClass: FakeElectronService }
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
