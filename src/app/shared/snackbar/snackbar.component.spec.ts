import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SnackbarComponent } from './snackbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        NgxElectronModule,
        MatSnackBarModule
      ],
      declarations: [SnackbarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ElectronService, useClass: FakeElectronService },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should have message container",()=>{
    const container = fixture.debugElement.query(By.css('.app-snackbar-toast'));
    const elementExist: boolean = container ? true : false;
    expect(elementExist).toBe(true);
  });
});
