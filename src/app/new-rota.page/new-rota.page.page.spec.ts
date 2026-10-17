import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRotaPagePage } from './new-rota.page.page';

describe('NewRotaPagePage', () => {
  let component: NewRotaPagePage;
  let fixture: ComponentFixture<NewRotaPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRotaPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
