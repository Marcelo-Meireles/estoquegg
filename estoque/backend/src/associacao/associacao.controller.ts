import { Controller, Post, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AssociacaoService } from './associacao.service';

@Controller('produtos/:produtoId/fornecedores')
export class AssociacaoController {
  constructor(private readonly service: AssociacaoService) {}

  @Post(':fornecedorId')
  associar(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Param('fornecedorId', ParseIntPipe) fornecedorId: number,
  ) {
    return this.service.associar(produtoId, fornecedorId);
  }

  @Delete(':fornecedorId')
  desassociar(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Param('fornecedorId', ParseIntPipe) fornecedorId: number,
  ) {
    return this.service.desassociar(produtoId, fornecedorId);
  }

  @Get()
  listar(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.service.listarFornecedoresDoProduto(produtoId);
  }
}
