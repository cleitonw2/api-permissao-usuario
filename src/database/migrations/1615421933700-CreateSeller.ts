import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSeller1615421933700 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "seller",
                columns: [
                    {
                        name: "id",
                        type: "uuid"
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "product_id",
                        type: "uuid"
                    },
                    {
                        name: "unity_sold",
                        type: "integer"
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
                ],
                foreignKeys: [
                    {
                        columnNames: ["product_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "products",
                        name: "fk_products_sellers",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        name: "fk_users_sellers",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("seller");
    }

}
