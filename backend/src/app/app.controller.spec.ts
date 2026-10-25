import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const appService = { check: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    appController = new AppController(appService as unknown as AppService);
  });

  it('reports the API health payload', () => {
    const payload = { status: 'ok', timestamp: '2026-10-22T00:00:00.000Z' };
    appService.check.mockReturnValue(payload);

    expect(appController.check()).toEqual(payload);
    expect(appService.check).toHaveBeenCalledTimes(1);
  });
});
