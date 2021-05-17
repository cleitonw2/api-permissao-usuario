import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Seller } from "./Seller";
import { User } from "./User";

@Entity("products")
class Product {

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

    @PrimaryColumn()
    readonly id: string;

    @Column()
    product_name: string;

    @Column()
    price: Number;

    @Column()
    bar_code: string;

    @Column()
    quantity_stock: Number;

    @Column()
    quantity_sold: Number;

    @Column()
    commission_by_sales: Number;

    @Column()
    allowed_membership: boolean;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @ManyToMany(() => Seller, seller => seller.products)
    @JoinTable()
    seller: Seller[];

    @ManyToMany(() => User)
    @JoinTable({
        name: "product_owner",
        joinColumns: [{ name: "product_id" }],
        inverseJoinColumns: [{ name: "user_id" }],
    })
    user: User[];
}

export { Product }