import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { Product } from "./Product";
import { User } from "./User";

@Entity("seller")
class Seller {

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;

    @Column()
    product_id: string;

    @Column()
    unity_sold: Number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @ManyToMany(() => Product)
    @JoinColumn({ name: "product_id" })
    product: Product
}

export { Seller }