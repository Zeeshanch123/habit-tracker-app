import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { HabitLogService } from './habit-log.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { NormalResponse } from '../common/normal-response';
import { HabitLog } from './entity/habit-log.entity';

@ApiTags('Habit Logs')
@Controller('habit-logs')
export class HabitLogController {
    constructor(private readonly habitLogService: HabitLogService) { }

    @Post()
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Create a new habit log' })
    @ApiBody({ type: CreateHabitLogDto })
    @ApiCreatedResponse({ description: 'Habit log created successfully', type: NormalResponse })
    @ApiBadRequestResponse({ description: 'Invalid input or habit not found' })
    @ApiBearerAuth()
    async create(@Req() req, @Body() dto: CreateHabitLogDto): Promise<NormalResponse<HabitLog>> {
        return this.habitLogService.create(dto, req.user.id);
    }

    @Get()
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Get all habit logs for the logged-in user' })
    @ApiOkResponse({ description: 'Habit logs retrieved successfully', type: NormalResponse })
    @ApiBearerAuth()
    async findAll(@Req() req): Promise<NormalResponse<HabitLog[]>> {
        return this.habitLogService.findAll(req.user.id);
    }

    @Get(':id')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Get habit log by ID' })
    @ApiParam({ name: 'id', description: 'Habit log UUID' })
    @ApiOkResponse({ description: 'Habit log retrieved successfully', type: NormalResponse })
    @ApiNotFoundResponse({ description: 'Habit log not found' })
    @ApiBearerAuth()
    async findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<HabitLog>> {
        return this.habitLogService.findOne(id, req.user.id);
    }

    @Put(':id')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Update a habit log' })
    @ApiParam({ name: 'id', description: 'Habit log UUID' })
    @ApiBody({ type: UpdateHabitLogDto })
    @ApiOkResponse({ description: 'Habit log updated successfully', type: NormalResponse })
    @ApiNotFoundResponse({ description: 'Habit log not found' })
    @ApiBearerAuth()
    async update(@Req() req, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateHabitLogDto): Promise<NormalResponse<HabitLog | null>> {
        return this.habitLogService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Delete a habit log' })
    @ApiParam({ name: 'id', description: 'Habit log UUID' })
    @ApiOkResponse({ description: 'Habit log deleted successfully', type: NormalResponse })
    @ApiNotFoundResponse({ description: 'Habit log not found' })
    @ApiBearerAuth()
    async remove(@Req() req, @Param('id', ParseUUIDPipe) id: string):Promise<NormalResponse<null>> {
        return this.habitLogService.remove(id, req.user.id);
    }
}
