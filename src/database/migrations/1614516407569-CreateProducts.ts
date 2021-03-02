import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProducts1614516407569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "product_name",
                        type: "varchar",
                    },
                    {
                        name: "price",
                        type: "numeric",
                    },
                    {
                        name: "bar_code",
                        type: "varchar",
                    },
                    {
                        name: "quantity_stock",
                        type: "integer",
                    },
                    {
                        name: "quantity_sold",
                        type: "integer",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
