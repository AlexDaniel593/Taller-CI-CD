import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';

@Module({
  controllers: [PersonaController],
  providers: [PersonaService],
  imports: [TypeOrmModule.forFeature([Persona])],
})
export class PersonaModule {}
