import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Fornecedor } from '../fornecedor/fornecedor.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  codigoBarras: string;

  @Column()
  descricao: string;

  @Column({ default: 0 })
  quantidadeEstoque: number;

  @Column()
  categoria: string;

  @Column({ nullable: true })
  dataValidade: string;

  @Column({ nullable: true })
  imagemUrl: string;

  @ManyToMany(() => Fornecedor, (fornecedor) => fornecedor.produtos, { cascade: true })
  @JoinTable()
  fornecedores: Fornecedor[];
}
