import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaquinaPagePage } from './maquina.page.page';

describe('MaquinaPagePage', () => {
  let component: MaquinaPagePage;
  let fixture: ComponentFixture<MaquinaPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinaPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
