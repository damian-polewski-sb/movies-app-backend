import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async editUser(userId: number, dto: EditUserDto, file?: Express.Multer.File) {
    let profilePictureUrl: string | undefined;
    let profilePictureId: string | undefined;

    let user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    profilePictureId = user?.profilePictureId;

    if (file) {
      const result = await this.cloudinaryService.uploadFile(
        file,
        profilePictureId,
      );
      profilePictureUrl = result?.url;
      profilePictureId = result?.public_id;
    }

    user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        profilePicture: profilePictureUrl,
        profilePictureId,
      },
    });

    delete user.hash;
    delete user.hashedRt;

    return user;
  }

  async getUserById(paramUserId: number, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: paramUserId,
      },
      include: {
        _count: {
          select: {
            Post: true,
            following: true,
            followers: true,
          },
        },
        following: {
          where: {
            followerId: userId,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      reviewsCount: user._count.Post,
      followersCount: user._count.following,
      followingCount: user._count.followers,
      isFollowed: user.following.length > 0 ? true : false,
    };
  }

  async getFollowers(userId: number) {
    return this.prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async getFollowing(userId: number) {
    return this.prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async followUser(followingId: number, followerId: number) {
    if (followingId === followerId)
      throw new ConflictException('User cannot follow themselves!');

    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });

    if (existingFollow)
      throw new ConflictException('User is already followed!');

    return this.prisma.follows.create({
      data: {
        followingId,
        followerId,
      },
    });
  }

  async unfollowUser(followingId: number, followerId: number) {
    if (followingId === followerId)
      throw new ConflictException('User cannot follow themselves!');

    const followRelation = await this.prisma.follows.findUnique({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });

    if (!followRelation) throw new NotFoundException('User is not followed!');

    return this.prisma.follows.delete({
      where: {
        followingId_followerId: {
          followingId,
          followerId,
        },
      },
    });
  }
}
