import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecucaoPagePage } from './execucao.page.page';

describe('ExecucaoPagePage', () => {
  let component: ExecucaoPagePage;
  let fixture: ComponentFixture<ExecucaoPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecucaoPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
