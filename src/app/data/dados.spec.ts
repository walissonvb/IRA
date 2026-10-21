import { TestBed } from '@angular/core/testing';
import { Dados } from './dados';

describe('Dados', () => {
  let service: Dados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
