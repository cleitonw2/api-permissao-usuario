import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";
import { v4 as uuid } from 'uuid';


@Entity("product_owner")
class ProductOwner {
    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: String;

    @Column()
    product_id: String;

    @ManyToOne(() => User, user => user.userProductOwner)
    @JoinColumn({ name: "user_id" })
    users: User[];

    @ManyToOne(() => Product, product => product.productOwner)
    @JoinColumn({ name: "product_id" })
    products: Product[];
}

export { ProductOwner };