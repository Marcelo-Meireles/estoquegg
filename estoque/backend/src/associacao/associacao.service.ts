import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../produto/produto.entity';
import { Fornecedor } from '../fornecedor/fornecedor.entity';

@Injectable()
export class AssociacaoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepo: Repository<Fornecedor>,
  ) {}

  private async getProduto(produtoId: number): Promise<Produto> {
    const produto = await this.produtoRepo.findOne({
      where: { id: produtoId },
      relations: { fornecedores: true },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  private async getFornecedor(fornecedorId: number): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepo.findOne({ where: { id: fornecedorId } });
    if (!fornecedor) throw new NotFoundException('Fornecedor não encontrado');
    return fornecedor;
  }

  async associar(produtoId: number, fornecedorId: number): Promise<Produto> {
    const produto = await this.getProduto(produtoId);
    const fornecedor = await this.getFornecedor(fornecedorId);

    const jaAssociado = produto.fornecedores.some((f) => f.id === fornecedorId);
    if (jaAssociado) {
      throw new ConflictException('Fornecedor já está associado a este produto!');
    }

    produto.fornecedores.push(fornecedor);
    return this.produtoRepo.save(produto);
  }

  async desassociar(produtoId: number, fornecedorId: number): Promise<Produto> {
    const produto = await this.getProduto(produtoId);
    await this.getFornecedor(fornecedorId);

    produto.fornecedores = produto.fornecedores.filter((f) => f.id !== fornecedorId);
    return this.produtoRepo.save(produto);
  }

  async listarFornecedoresDoProduto(produtoId: number): Promise<Fornecedor[]> {
    const produto = await this.getProduto(produtoId);
    return produto.fornecedores;
  }
}
