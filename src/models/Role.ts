import {
    Column, CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Permission } from "./Permission";

@Entity("roles")
class Role {

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
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "permissions_roles",
        joinColumns: [{ name: "role_id" }],
        inverseJoinColumns: [{ name: "permission_id" }],
    })
    permission: Permission[];
}

export { Role }