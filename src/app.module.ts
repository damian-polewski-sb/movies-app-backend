import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TMDBModule } from './tmdb/tmdb.module';
import { MovieModule } from './movie/movie.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ListModule } from './list/list.module';
import { PostModule } from './post/post.module';
import { NotificationModule } from './notification/notification.module';

const CACHE_TTL = 600000; // 10 mins

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: CACHE_TTL,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TMDBModule,
    MovieModule,
    ListModule,
    PostModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
