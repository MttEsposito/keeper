import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { KeeperComponent } from './keeper.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';
import { ThemeService } from 'src/app/services/theme.service';

describe('KeeperComponent', () => {
  let component: KeeperComponent;
  let fixture: ComponentFixture<KeeperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        NgxElectronModule
      ],
      declarations: [ KeeperComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ThemeService,{ provide: ElectronService, useClass: FakeElectronService }]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
