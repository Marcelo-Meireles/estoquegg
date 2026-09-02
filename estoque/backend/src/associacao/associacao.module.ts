import { Module } from '@nestjs/common';
import { ProdutoModule } from '../produto/produto.module';
import { FornecedorModule } from '../fornecedor/fornecedor.module';
import { AssociacaoService } from './associacao.service';
import { AssociacaoController } from './associacao.controller';

@Module({
  imports: [ProdutoModule, FornecedorModule],
  controllers: [AssociacaoController],
  providers: [AssociacaoService],
})
export class AssociacaoModule {}
