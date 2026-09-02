import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto, UpdateProdutoDto } from './produto.dto';

@Controller('produtos')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ProdutoController {
  constructor(private readonly service: ProdutoService) {}

  @Post()
  criar(@Body() dto: CreateProdutoDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }

  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProdutoDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
