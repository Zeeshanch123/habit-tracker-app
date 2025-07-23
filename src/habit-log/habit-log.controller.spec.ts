import { Test, TestingModule } from '@nestjs/testing';
import { HabitLogController } from './habit-log.controller';

describe('HabitLogController', () => {
  let controller: HabitLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitLogController],
    }).compile();

    controller = module.get<HabitLogController>(HabitLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
