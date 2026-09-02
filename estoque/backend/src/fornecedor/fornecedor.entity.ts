import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Produto } from '../produto/produto.entity';

@Entity()
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeEmpresa: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  endereco: string;

  @Column()
  telefone: string;

  @Column()
  email: string;

  @Column()
  contatoPrincipal: string;

  @ManyToMany(() => Produto, (produto) => produto.fornecedores)
  produtos: Produto[];
}
