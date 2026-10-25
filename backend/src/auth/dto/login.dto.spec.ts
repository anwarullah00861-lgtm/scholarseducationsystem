import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'admin@scholars.edu',
      password: 'correct-password',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects a malformed email and a short password', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'not-an-email',
      password: 'abc',
    });

    const errors = await validate(dto);
    const properties = errors.flatMap((error) => error.property);

    expect(properties).toEqual(expect.arrayContaining(['email', 'password']));
  });

  it('rejects a missing password', async () => {
    const dto = plainToInstance(LoginDto, { email: 'admin@scholars.edu' });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain('password');
  });
});
