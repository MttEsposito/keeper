import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { KeeperComponent } from './keeper.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { FakeElectronService } from 'tests/electron-faker.service';

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
      providers: [{ provide: ElectronService, useClass: FakeElectronService }]

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
  it('should have a sidenav', () => {
    const container = fixture.debugElement.query(By.css('mat-sidenav'));
    const elementExist: boolean = container ? true : false;
    expect(elementExist).toBe(true);
  });
  it('sidenav should have actions', () => {
    const container = fixture.debugElement.queryAll(By.css('.sidenav-action')).length;
    const sections = fixture.componentInstance.sections.length;
    const elementExist: boolean = (container === sections) ? true : false;
    expect(elementExist).toBe(true);
  });
});
