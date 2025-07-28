// src/plans/plans.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entity/plans.entity';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
    ) { }

    async create(createPlanDto: CreatePlanDto): Promise<Plan> {
        const plan = this.planRepository.create(createPlanDto);
        return this.planRepository.save(plan);
    }

    async findAll(): Promise<Plan[]> {
        return this.planRepository.find();
    }
}
