import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
  it('should have the component container', () => {
    const container = fixture.debugElement.query(By.css('#SignIn'));
    const elementExist: boolean = container ? true : false;
    expect(elementExist).toBe(true);
  });
  it('should have a title', () => {
    const container = fixture.debugElement.nativeElement;
    expect(container.querySelector('mat-card-title').textContent).toContain("Keeper");
  });
  it('should have the form for sign in', () => {
    const container = fixture.debugElement.query(By.css('form.sign-form'));
    const elementExist: boolean = container ? true : false;
    expect(elementExist).toBe(true);
  });
  it('the form should have an input and a button', () => {
    const pswInput = fixture.debugElement.query(By.css("input[type='password']"));
    const button = fixture.debugElement.query(By.css("button[type='submit']"));
    const elements = [pswInput?true:false,button?true:false];
    const elementExist: boolean = elements.includes(false) ? false : true;
    expect(elementExist).toBe(true);
  });
});
