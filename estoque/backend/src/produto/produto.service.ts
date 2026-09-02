import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto, UpdateProdutoDto } from './produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly repo: Repository<Produto>,
  ) {}

  async criar(dto: CreateProdutoDto): Promise<Produto> {
    const existente = await this.repo.findOne({ where: { codigoBarras: dto.codigoBarras } });
    if (existente) {
      throw new ConflictException('Produto com este código de barras já está cadastrado!');
    }
    const produto = this.repo.create(dto);
    return this.repo.save(produto);
  }

  listar(): Promise<Produto[]> {
    return this.repo.find({ relations: { fornecedores: true } });
  }

  async buscarPorId(id: number): Promise<Produto> {
    const produto = await this.repo.findOne({ where: { id }, relations: { fornecedores: true } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async atualizar(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.buscarPorId(id);
    Object.assign(produto, dto);
    return this.repo.save(produto);
  }

  async remover(id: number): Promise<void> {
    const produto = await this.buscarPorId(id);
    await this.repo.remove(produto);
  }
}
