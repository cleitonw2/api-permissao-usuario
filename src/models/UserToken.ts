import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "./User";

@Entity("user_tokens")
class UserToken {

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }

        if (!this.token) {
            this.token = uuid();
        }
    }

    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.userTokens)
    @JoinColumn({ name: "user_id" })
    users: User[];
}

export { UserToken };