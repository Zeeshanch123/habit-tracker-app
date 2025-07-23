import { Test, TestingModule } from '@nestjs/testing';
import { HabitLogService } from './habit-log.service';

describe('HabitLogService', () => {
  let service: HabitLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitLogService],
    }).compile();

    service = module.get<HabitLogService>(HabitLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
