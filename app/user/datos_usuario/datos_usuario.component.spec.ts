import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosUsuarioComponent } from './datos_usuario.component';

describe('ProfileComponent', () => {
  let component: DatosUsuarioComponent;
  let fixture: ComponentFixture<DatosUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});