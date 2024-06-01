import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import * as pactum from 'pactum';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    app.use(cookieParser());

    await app.init();

    await app.listen(8081);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:8081');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com',
      password: '123',
    };

    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/local/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/local/signin').expectStatus(400);
      });

      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'accessToken');
      });
    });

    describe('Refresh', () => {
      let userRt: string;

      beforeAll(async () => {
        const cookies = await pactum
          .spec()
          .post('/auth/local/signin')
          .withBody(dto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        userRt = cookies[0];
      });

      it('should throw if refreshToken not provided', () => {
        return pactum.spec().get('/auth/refresh').expectStatus(401);
      });

      it('should throw if wrong accessToken provided', () => {
        return pactum
          .spec()
          .get('/auth/refresh')
          .withCookies('refreshToken=123; HttpOnly; SameSite=Strict')
          .expectStatus(401);
      });

      it('should refresh', () => {
        return pactum
          .spec()
          .get('/auth/refresh')
          .withCookies(userRt)
          .expectStatus(200);
      });
    });

    describe('Logout', () => {
      let userRt: string;

      beforeAll(async () => {
        const cookies = await pactum
          .spec()
          .post('/auth/local/signin')
          .withBody(dto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        userRt = cookies[0];
      });

      it('should throw if no accessToken provided', () => {
        return pactum.spec().post('/auth/logout').expectStatus(401);
      });

      it('should throw if wrong accessToken provided', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer abc',
          })
          .expectStatus(401);
      });

      it('should logout', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('should not refresh after logout', () => {
        return pactum
          .spec()
          .get('/auth/refresh')
          .withCookies(userRt)
          .expectStatus(403);
      });
    });
  });

  describe('Users', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });
});
