import { IsNotEmpty, IsOptional, IsString, IsEmail, Matches } from 'class-validator';

export class CreateFornecedorDto {
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  nomeEmpresa: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato 00.000.000/0000-00',
  })
  cnpj: string;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Contato principal é obrigatório' })
  contatoPrincipal: string;
}

export class UpdateFornecedorDto {
  @IsOptional()
  @IsString()
  nomeEmpresa?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  contatoPrincipal?: string;
}
