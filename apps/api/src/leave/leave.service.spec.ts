import { LeaveService } from './leave.service';

describe('LeaveService', () => {
  it('should be defined', () => {
    const service = new LeaveService({} as any, {} as any);
    expect(service).toBeDefined();
  });
});
