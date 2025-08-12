import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3: AWS.S3;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly allowedVideoTypes = ['video/mp4', 'video/quicktime'];

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('cloud.aws.s3.bucket');
    this.region = this.configService.get<string>('cloud.aws.region');
    
    this.s3 = new AWS.S3({
      region: this.region,
      accessKeyId: this.configService.get<string>('cloud.aws.accessKeyId'),
      secretAccessKey: this.configService.get<string>('cloud.aws.secretAccessKey'),
    });
  }

  async uploadPostMedia(files: Express.Multer.File[], userId: string): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    // Validar archivos
    this.validateFiles(files);

    const uploadPromises = files.map(file => this.uploadSingleFile(file, userId));
    return Promise.all(uploadPromises);
  }

  async deletePostMedia(mediaUrls: string[]): Promise<void> {
    if (!mediaUrls || mediaUrls.length === 0) {
      return;
    }

    const deletePromises = mediaUrls.map(url => this.deleteSingleFile(url));
    await Promise.all(deletePromises);
  }

  private async uploadSingleFile(file: Express.Multer.File, userId: string): Promise<string> {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const filename = `posts/${userId}/${uuidv4()}${fileExtension}`;

    let processedBuffer = file.buffer;
    let contentType = file.mimetype;

    // Procesar imágenes
    if (this.allowedImageTypes.includes(file.mimetype)) {
      processedBuffer = await this.processImage(file.buffer);
      contentType = 'image/webp'; // Convertir todo a WebP para optimización
    }

    const uploadParams = {
      Bucket: this.bucketName,
      Key: filename,
      Body: processedBuffer,
      ContentType: contentType,
      ACL: 'public-read',
      Metadata: {
        'original-name': file.originalname,
        'uploaded-by': userId,
        'upload-timestamp': new Date().toISOString(),
      },
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      throw new BadRequestException(`Error al subir archivo: ${error.message}`);
    }
  }

  private async deleteSingleFile(mediaUrl: string): Promise<void> {
    try {
      // Extraer la key del URL
      const urlParts = mediaUrl.split('/');
      const key = urlParts.slice(-3).join('/'); // posts/userId/filename

      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key,
      }).promise();
    } catch (error) {
      console.error(`Error al eliminar archivo ${mediaUrl}:`, error);
      // No lanzar error para no interrumpir la eliminación de otros archivos
    }
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      // Procesar imagen: redimensionar, optimizar y convertir a WebP
      return await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer();
    } catch (error) {
      throw new BadRequestException('Error al procesar la imagen');
    }
  }

  private validateFiles(files: Express.Multer.File[]): void {
    // Límite de archivos
    if (files.length > 10) {
      throw new BadRequestException('Máximo 10 archivos por publicación');
    }

    for (const file of files) {
      // Validar tamaño
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(`El archivo ${file.originalname} excede el tamaño máximo de 10MB`);
      }

      // Validar tipo
      const isValidImage = this.allowedImageTypes.includes(file.mimetype);
      const isValidVideo = this.allowedVideoTypes.includes(file.mimetype);

      if (!isValidImage && !isValidVideo) {
        throw new BadRequestException(
          `Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, WebP) y videos (MP4, MOV)`
        );
      }

      // Validar nombre del archivo
      if (!file.originalname || file.originalname.length > 255) {
        throw new BadRequestException('Nombre de archivo inválido');
      }
    }
  }

  async generateThumbnail(imageUrl: string): Promise<string> {
    try {
      // Descargar imagen original
      const response = await fetch(imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Generar thumbnail
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer();

      // Subir thumbnail
      const thumbnailKey = imageUrl.replace('/posts/', '/thumbnails/posts/');
      const uploadParams = {
        Bucket: this.bucketName,
        Key: this.extractKeyFromUrl(thumbnailKey),
        Body: thumbnailBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Error al generar thumbnail:', error);
      return imageUrl; // Retornar imagen original si falla
    }
  }

  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts.slice(-3).join('/');
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: expiresIn,
    });
  }

  async uploadProfileImage(file: Express.Multer.File, userId: string): Promise<string> {
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes para el avatar');
    }

    const filename = `avatars/${userId}/avatar_${uuidv4()}.webp`;
    
    // Procesar imagen de avatar (cuadrada, más pequeña)
    const processedBuffer = await sharp(file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 90 })
      .toBuffer();

    const uploadParams = {
      Bucket: this.bucketName,
      Key: filename,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    };

    const result = await this.s3.upload(uploadParams).promise();
    return result.Location;
  }
}
