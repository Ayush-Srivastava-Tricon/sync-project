import { TestBed } from '@angular/core/testing';

import { RoleInterceptor } from './role.interceptor';

describe('RoleInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RoleInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RoleInterceptor = TestBed.inject(RoleInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
