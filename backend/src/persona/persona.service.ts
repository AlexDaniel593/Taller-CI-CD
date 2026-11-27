import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personas: Repository<Persona>,
  ) {}

  async create(dto: CreatePersonaDto): Promise<Persona> {
    try {
      return await this.personas.save(this.personas.create(dto));
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  findAll(): Promise<Persona[]> {
    return this.personas.find({ order: { apellidos: 'ASC', nombres: 'ASC' } });
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personas.findOneBy({ id_persona: id });
    if (!persona) throw new NotFoundException(`No existe la persona ${id}`);
    return persona;
  }

  async update(id: string, dto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);
    try {
      return await this.personas.save(persona);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const persona = await this.findOne(id);
    await this.personas.remove(persona);
  }

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === '23505'
    ) {
      throw new ConflictException('La identificación ya está registrada');
    }
    throw error;
  }
}
