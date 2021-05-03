import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Seller } from "./Seller";

@Entity("products")
class Product {

    constructor() {
        if(!this.id) {
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

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    
    @ManyToMany(() => Seller, seller => seller.products)
    @JoinTable()
    seller: Seller[];
}

export { Product }