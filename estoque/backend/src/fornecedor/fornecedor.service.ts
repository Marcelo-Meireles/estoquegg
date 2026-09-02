import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './fornecedor.entity';
import { CreateFornecedorDto, UpdateFornecedorDto } from './fornecedor.dto';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private readonly repo: Repository<Fornecedor>,
  ) {}

  async criar(dto: CreateFornecedorDto): Promise<Fornecedor> {
    const existente = await this.repo.findOne({ where: { cnpj: dto.cnpj } });
    if (existente) {
      throw new ConflictException('Fornecedor com esse CNPJ já está cadastrado!');
    }
    const fornecedor = this.repo.create(dto);
    return this.repo.save(fornecedor);
  }

  listar(): Promise<Fornecedor[]> {
    return this.repo.find();
  }

  async buscarPorId(id: number): Promise<Fornecedor> {
    const fornecedor = await this.repo.findOne({ where: { id } });
    if (!fornecedor) throw new NotFoundException('Fornecedor não encontrado');
    return fornecedor;
  }

  async atualizar(id: number, dto: UpdateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = await this.buscarPorId(id);
    Object.assign(fornecedor, dto);
    return this.repo.save(fornecedor);
  }

  async remover(id: number): Promise<void> {
    const fornecedor = await this.buscarPorId(id);
    await this.repo.remove(fornecedor);
  }
}
