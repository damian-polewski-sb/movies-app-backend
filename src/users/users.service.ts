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

    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      profilePictureUrl = result?.url;
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        profilePicture: profilePictureUrl,
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
