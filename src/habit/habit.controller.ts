import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { NormalResponse } from '../common/normal-response';
import { Habit } from './entity/habit.entity';


@ApiTags('Habits')
@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) { }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiBody({ type: CreateHabitDto })
  @ApiCreatedResponse({ description: 'Habit created successfully', type: NormalResponse })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBearerAuth()
  async create(@Req() req, @Body() dto: CreateHabitDto): Promise<NormalResponse<Habit>> {
    return await this.habitService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get all habits for the logged-in user' })
  @ApiOkResponse({ description: 'Habits retrieved successfully', type: NormalResponse })
  @ApiBearerAuth()
  async findAll(@Req() req): Promise<NormalResponse<Habit[]>> {
    return await this.habitService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiParam({ name: 'id', description: 'Habit UUID' })
  @ApiOkResponse({ description: 'Habit retrieved successfully', type: NormalResponse })
  @ApiNotFoundResponse({ description: 'Habit not found' })
  @ApiBearerAuth()
  async findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<Habit>> {
    return await this.habitService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Update a habit' })
  @ApiParam({ name: 'id', description: 'Habit UUID' })
  @ApiBody({ type: UpdateHabitDto })
  @ApiOkResponse({ description: 'Habit updated successfully', type: NormalResponse })
  @ApiNotFoundResponse({ description: 'Habit not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBearerAuth()
  async update(@Req() req, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateHabitDto): Promise<NormalResponse<Habit | null>> {
    return await this.habitService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'id', description: 'Habit UUID' })
  @ApiOkResponse({ description: 'Habit deleted successfully', type: NormalResponse })
  @ApiNotFoundResponse({ description: 'Habit not found' })
  @ApiBearerAuth()
  async remove(@Req() req, @Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<null>> {
    return await this.habitService.remove(id, req.user.id);
  }
}
