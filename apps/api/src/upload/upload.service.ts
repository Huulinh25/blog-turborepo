import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const isImage = !!file.mimetype && file.mimetype.startsWith('image/');
    if (!isImage) {
      // Try to infer type from filename
      const lower = (file.originalname || '').toLowerCase();
      const inferred = lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp');
      if (!inferred) {
        throw new BadRequestException(
          `Invalid file type. Only images are allowed. Received: ${file.mimetype || 'unknown'}`,
        );
      }
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, '_');
      const filePath = `thumbnails/${timestamp}_${originalName}`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('thumbnails')
        .upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype && isImage ? file.mimetype : this.inferMimeFromName(file.originalname) || 'image/png',
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new BadRequestException(`Failed to upload file to storage: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload service error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process file upload');
    }
  }

  private inferMimeFromName(name?: string | null): string | null {
    if (!name) return null;
    const lower = name.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.gif')) return 'image/gif';
    if (lower.endsWith('.webp')) return 'image/webp';
    return null;
    }

  async deleteThumbnail(url: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `thumbnails/${fileName}`;

      const { error } = await this.supabase.storage
        .from('thumbnails')
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete service error:', error);
      return false;
    }
  }
}
