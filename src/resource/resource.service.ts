import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { Resource } from './entity/resource.entity';
import { Habit } from 'src/habit/entity/habit.entity';
import { NormalResponse } from '../common/normal-response';
import * as mime from 'mime-types';
import { supabase } from './storage.provider';
import { UpdateResourceDto } from './dto/update-resource.dto';


@Injectable()
export class ResourceService {
    constructor(
        @InjectRepository(Resource)
        private resourceRepo: Repository<Resource>,
        @InjectRepository(Habit)
        private habitRepo: Repository<Habit>,
    ) { }

    async uploadResource(
        // file: Express.Multer.File,
        files: Express.Multer.File[],
        dto: CreateResourceDto,
        userId: string): Promise<NormalResponse<Resource[]>> {
        try {

            // if (!file) {
            //     throw new BadRequestException('File is required');
            // }

            if (!files || files.length === 0) {
                throw new BadRequestException('At least one file is required');
            }

            const habit = await this.habitRepo.findOne({
                where: { id: dto.habit_id, user: { id: userId } },
            });

            if (!habit) {
                throw new BadRequestException('Habit not found or does not belong to user.');
            }

            // 1 single file upload method

            // // Upload to Supabase
            // const filePath = `${userId}/${Date.now()}_${file.originalname}`;
            // const { data, error } = await supabaseStorage.upload(filePath, file.buffer, {
            //     contentType: file.mimetype,
            // });

            // if (error) {
            //     throw new BadRequestException(`Supabase upload failed: ${error.message}`);
            // }


            // const publicUrlResponse = supabaseStorage.getPublicUrl(filePath);
            // const publicUrl = publicUrlResponse.data?.publicUrl;

            // if (!publicUrl) {
            //     throw new BadRequestException('Failed to retrieve public URL.');
            // }

            // // Save resource to DB
            // const resource = this.resourceRepo.create({
            //     ...dto,
            //     url: publicUrl,
            //     habit,
            // });

            // await this.resourceRepo.save(resource);

            // return {
            //     success: true,
            //     message: 'Resource uploaded successfully',
            //     data: resource,
            // };

            // 2 multiple files upload method


            const uploadedResources: Resource[] = [];

            for (const file of files) {
                const filePath = `${userId}/${Date.now()}_${file.originalname}`;

                const contentType = file.mimetype === 'application/octet-stream'
                    ? mime.lookup(file.originalname) || 'application/octet-stream'
                    : file.mimetype;

                // 
                // const { error } = await supabaseStorage.upload(filePath, file.buffer, {
                //     // contentType: file.mimetype,
                //     contentType
                // });

                // Upload to private bucket `media`
                const { error } = await supabase.storage.from('media').upload(filePath, file.buffer, {
                    contentType,
                    upsert: false,
                });

                if (error) {
                    throw new BadRequestException(`Supabase upload failed: ${error.message}`);
                }

                // public bucket
                // const publicUrlResponse = supabaseStorage.getPublicUrl(filePath);
                // const publicUrl = publicUrlResponse.data?.publicUrl;

                // if (!publicUrl) {
                //     throw new BadRequestException('Failed to retrieve public URL.');
                // }

                // const resource = this.resourceRepo.create({
                //     ...dto,
                //     url: publicUrl,
                //     habit,
                // });

                // await this.resourceRepo.save(resource);
                // uploadedResources.push(resource);

                // private bucket
                // Generate signed URL for private file (expires in 1 hour)
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('media')
                    .createSignedUrl(filePath, 60 * 60); // 1 hour in seconds

                if (signedUrlError || !signedUrlData.signedUrl) {
                    throw new BadRequestException('Failed to generate signed URL.');
                }

                // Save resource metadata with signed URL as `url`
                const resource = this.resourceRepo.create({
                    ...dto,
                    type: "media",
                    // url: signedUrlData.signedUrl,
                    url: filePath,
                    habit,
                });

                await this.resourceRepo.save(resource);
                uploadedResources.push(resource);

            }

            return {
                success: true,
                message: 'Resources uploaded successfully',
                data: uploadedResources,
            };

        } catch (err) {
            console.log("err:", err);
            throw new BadRequestException(err.message);
        }
    }

    async getResourcesByHabitId(habitId: string, userId: string): Promise<NormalResponse<Resource[]>> {
        try {
            const habit = await this.habitRepo.findOne({
                where: { id: habitId, user: { id: userId } }
            });

            if (!habit) {
                throw new NotFoundException('Habit not found or not authorized');
            }

            const resources = await this.resourceRepo.find({
                where: { habit: { id: habitId } },
                relations: ['habit'],
                order: { uploaded_at: 'DESC' },
            });

            const signedResources = await Promise.all(resources.map(async (res) => {
                const { data, error } = await supabase.storage
                    .from('media')
                    .createSignedUrl(res.url, 60 * 60);

                if (!error && data?.signedUrl) {
                    res.url = data.signedUrl;
                }

                return res;
            }));

            return {
                success: true,
                message: 'Resources for habit fetched successfully',
                data: signedResources,
            };
        } catch (err) {
            console.error('Error in getResourcesByHabitId:', err);
            throw new BadRequestException(err.message);
        }
    }

    async getResourceById(id: string, userId: string): Promise<NormalResponse<Resource>> {
        try {

            const resource = await this.resourceRepo.findOne({
                where: { id },
                relations: ['habit'],
            });

            if (!resource || !resource.habit) {
                throw new NotFoundException('Resource not found');
            }

            const { data, error } = await supabase.storage
                .from('media')
                .createSignedUrl(resource.url, 60 * 60);

            if (!error && data?.signedUrl) {
                resource.url = data.signedUrl;
            }

            return {
                success: true,
                message: 'Resource fetched successfully',
                data: resource,
            };
        } catch (err) {
            console.error('Error in getResourceById:', err);
            throw new BadRequestException(err.message);
        }
    }

    // async updateResource(
    //     id: string,
    //     userId: string,
    //     dto: UpdateResourceDto,
    //     files: Express.Multer.File[],
    // ): Promise<NormalResponse<Resource>> {
    //     const resource = await this.resourceRepo.findOne({
    //         where: { id },
    //         relations: ['habit'],
    //     });

    //     if (!resource || !resource.habit) {
    //         throw new NotFoundException('Resource not found');
    //     }

    //     // Delete old file from Supabase
    //     if (files?.length) {
    //         await supabase.storage.from('media').remove([resource.url]);

    //         const file = files[0];
    //         const filePath = `${userId}/${Date.now()}_${file.originalname}`;
    //         const contentType = file.mimetype;

    //         const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file.buffer, {
    //             contentType,
    //             upsert: false,
    //         });

    //         if (uploadError) {
    //             throw new BadRequestException(`Supabase upload failed: ${uploadError.message}`);
    //         }

    //         resource.url = filePath;
    //         resource.type = 'media';
    //     }

    //     if (dto.title) {
    //         resource.title = dto.title;
    //     }

    //     await this.resourceRepo.save(resource);

    //     return {
    //         success: true,
    //         message: 'Resource updated successfully',
    //         data: resource,
    //     };
    // }



    async deleteResource(id: string, userId: string): Promise<NormalResponse<null>> {

        const resource = await this.resourceRepo.findOne({
            where: { id },
            relations: ['habit'],
        });

        if (!resource || !resource.habit) {
            throw new NotFoundException('Resource not found');
        }

        const { error } = await supabase.storage.from('media').remove([resource.url]);
        if (error) {
            console.warn('Supabase deletion failed:', error.message);
        }

        await this.resourceRepo.remove(resource);

        return {
            success: true,
            message: 'Resource deleted successfully',
            data: null,
        };
    }



}
