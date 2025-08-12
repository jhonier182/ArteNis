import { Injectable } from '@nestjs/common';
import { Post } from '@domain/post/entities/post';
import { PostResponseDto } from '@interfaces/rest/dto/post-response.dto';

@Injectable()
export class PostMapper {
  toResponseDto(post: Post): PostResponseDto {
    return {
      id: post.id,
      userId: post.userId,
      type: post.type,
      title: post.title,
      description: post.description,
      tags: post.tags,
      styles: post.styles,
      status: post.status,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      savesCount: post.savesCount,
      sharesCount: post.sharesCount,
      viewsCount: post.viewsCount,
      location: post.location,
      tattooDetails: post.tattooDetails,
      isPromoted: post.isPromoted,
      promotedUntil: post.promotedUntil,
      allowComments: post.allowComments,
      allowSharing: post.allowSharing,
      scheduledAt: post.scheduledAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      mediaUrls: post.mediaUrls,
    };
  }
}


