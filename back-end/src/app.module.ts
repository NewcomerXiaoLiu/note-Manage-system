import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { D1Service } from './common/d1/d1.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GroupsModule } from './modules/groups/groups.module';
import { NotesModule } from './modules/notes/notes.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, GroupsModule, NotesModule, DashboardModule],
  providers: [
    D1Service,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
  exports: [D1Service],
})
export class AppModule {}
