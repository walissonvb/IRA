import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotaPagePage } from './rota.page.page';

describe('RotaPagePage', () => {
  let component: RotaPagePage;
  let fixture: ComponentFixture<RotaPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
