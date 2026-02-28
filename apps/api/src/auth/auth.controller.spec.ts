import { AuthController } from './auth.controller';

describe('AuthController', () => {
  it('login delegates to service', async () => {
    const service = { login: jest.fn().mockResolvedValue({ accessToken: 'x' }) } as any;
    const controller = new AuthController(service);
    await expect(controller.login({ email: 'a@a.com', password: 'Password123!' })).resolves.toEqual({ accessToken: 'x' });
  });
});
