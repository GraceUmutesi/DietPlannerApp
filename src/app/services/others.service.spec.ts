import { TestBed } from '@angular/core/testing';

import { OthersService } from './others.service';

describe('OthersService', () => {
  let service: OthersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OthersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
