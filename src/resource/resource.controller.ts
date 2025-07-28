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
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UploadedFiles,
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
    ApiConsumes,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { NormalResponse } from '../common/normal-response';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateResourceDto } from './dto/create-resource.dto';
import { ResourceService } from './resource.service';
import { Resource } from './entity/resource.entity';
import { UpdateResourceDto } from './dto/update-resource.dto';


@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) { }

    @Post('upload')
    @UseGuards(SupabaseAuthGuard)
    @ApiOperation({ summary: 'Upload a resource file' })
    @ApiCreatedResponse({ description: 'Resource uploaded successfully', type: NormalResponse })
    @ApiBadRequestResponse({ description: 'Invalid input or habit not found' })
    // @UseInterceptors(FileInterceptor('media'))
    // @UseInterceptors(FilesInterceptor('media'))
    @UseInterceptors(FilesInterceptor('media', 10, {
        limits: { fileSize: 50 * 1024 * 1024 },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    // @ApiBody({
    //     required: true,
    //     schema: {
    //       type: 'object',
    //       properties: {
    //         habit_id: { type: 'string', format: 'uuid' },
    //         type: { type: 'string' },
    //         title: { type: 'string' },
    //         file: { type: 'string', format: 'binary' },
    //       },
    //       required: ['habit_id', 'type', 'title', 'file'],
    //     },
    //   })
    async upload(
        @Req() req,
        // @UploadedFile() file: Express.Multer.File,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreateResourceDto
    ): Promise<NormalResponse<Resource[]>> {
        // return this.resourceService.uploadResource(file, dto, req.user.id);
        return this.resourceService.uploadResource(files, dto, req.user.id);
    }

    @Get('by-habit/:habitId')
    @UseGuards(SupabaseAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get resources by habit ID for logged-in user' })
    @ApiOkResponse({ description: 'Resources retrieved successfully', type: NormalResponse })
    @ApiBadRequestResponse({ description: 'Invalid input or habit not found' })
    async getResourcesByHabitId(
        @Req() req,
        @Param('habitId', ParseUUIDPipe) habitId: string
    ): Promise<NormalResponse<Resource[]>> {
        return this.resourceService.getResourcesByHabitId(habitId, req.user.id);
    }

    @Get(':id')
    @UseGuards(SupabaseAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a single resource by ID with signed URL' })
    @ApiOkResponse({ description: 'Resource retrieved successfully', type: NormalResponse })
    @ApiBadRequestResponse({ description: 'Invalid resource ID format or signed URL error' })
    @ApiNotFoundResponse({ description: 'Resource not found or not authorized' })
    async getResourceById(
        @Req() req,
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<NormalResponse<Resource>> {
        return this.resourceService.getResourceById(id, req.user.id);
    }

    // @Put(':id')
    // @UseGuards(SupabaseAuthGuard)
    // @UseInterceptors(FilesInterceptor('media', 10, {
    //     limits: { fileSize: 50 * 1024 * 1024 },
    // }))
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Update a resource' })
    // @ApiOkResponse({ description: 'Resource updated successfully', type: NormalResponse })
    // @ApiBadRequestResponse({ description: 'Invalid input or resource not found' })
    // @ApiNotFoundResponse({ description: 'Resource not found or unauthorized' })
    // @ApiConsumes('multipart/form-data')
    // async updateResource(
    //     @Req() req,
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @UploadedFiles() files: Express.Multer.File[],
    //     @Body() dto: UpdateResourceDto
    // ): Promise<NormalResponse<Resource>> {
    //     return this.resourceService.updateResource(id, req.user.id, dto, files);
    // }


    @Delete(':id')
    @UseGuards(SupabaseAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a resource by ID' })
    @ApiOkResponse({ description: 'Resource deleted successfully', type: NormalResponse })
    @ApiNotFoundResponse({ description: 'Resource not found or not authorized' })
    async deleteResource(
        @Req() req,
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<NormalResponse<null>> {
        return this.resourceService.deleteResource(id, req.user.id);
    }


}
