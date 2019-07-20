import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AccountsComponent } from './accounts.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { NgxElectronModule, ElectronService} from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { MatSnackBarModule } from '@angular/material';


describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxElectronModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        MatTooltipModule
      ],
      declarations: [ AccountsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ElectronService, useClass: FakeElectronService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a title', () => {
    const container = fixture.debugElement.nativeElement;
    expect(container.querySelector('mat-card-title').textContent).toContain("Accounts");
  });
  it('should have a searchbar', () => {
    const searchbar = fixture.debugElement.query(By.css("#Searchbar mat-form-field input[type='text']"));
    const elementExist: boolean = searchbar ? true : false;
    expect(elementExist).toBe(true);
  });
  it('should have a fab button', () => {
    const fabButton = fixture.debugElement.query(By.css(".acc-fab-bottom-right"));
    const elementExist: boolean = fabButton ? true : false;
    expect(elementExist).toBe(true);
  });
});
