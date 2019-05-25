import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsComponent } from './accounts.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxElectronModule, ElectronService} from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { MatSnackBarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';


describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxElectronModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatButtonModule
      ],
      declarations: [AccountsComponent],
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
});
