import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
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
    };
  }
}
