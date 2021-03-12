import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { Role } from "./Role";
import { Seller } from "./Seller";

@Entity("users")
class User {

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    passwordResetToken: string;

    @Column()
    passwordResetExpires: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "users_roles",
        joinColumns: [{ name: "user_id" }],
        inverseJoinColumns: [{ name: "role_id" }],
    })
    roles: Role[];

    @ManyToMany(() => Seller, seller => seller.users)
    @JoinTable()
    seller: Seller[];

}

export { User }