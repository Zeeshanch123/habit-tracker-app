import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entity/plans.entity';

@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    @Post()
    async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
        return this.plansService.create(createPlanDto);
    }

    @Get()
    async getAllPlans(): Promise<Plan[]> {
        return this.plansService.findAll();
    }
}
