import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutoModule } from './produto/produto.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { AssociacaoModule } from './associacao/associacao.module';
import { UploadModule } from './upload/upload.module';
import { Produto } from './produto/produto.entity';
import { Fornecedor } from './fornecedor/fornecedor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'estoque.db',
      entities: [Produto, Fornecedor],
      synchronize: true,
    }),
    ProdutoModule,
    FornecedorModule,
    AssociacaoModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
