import { IsNotEmpty, IsOptional, IsString, IsInt, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  nome: string;

  @IsNotEmpty({ message: 'Código de barras é obrigatório' })
  codigoBarras: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantidadeEstoque?: number;

  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  categoria: string;

  @IsOptional()
  @IsString()
  dataValidade?: string;

  @IsOptional()
  @IsString()
  imagemUrl?: string;
}

export class UpdateProdutoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantidadeEstoque?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  dataValidade?: string;

  @IsOptional()
  @IsString()
  imagemUrl?: string;
}
