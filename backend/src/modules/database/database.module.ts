import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Folder } from '../folder/entities/folder.entity';
import { File } from '../folder/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',  // ✅ UBAH INI DARI 'postgres' JADI 'mysql'
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USERNAME', 'root'),
        password: configService.get('DATABASE_PASSWORD', ''),
        database: configService.get('DATABASE_NAME', 'fileexplorer'),
        entities: [Folder, File],
        synchronize: true, // Set to false in production
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}