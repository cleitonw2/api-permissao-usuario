import { Column, MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserProducts1621122223526 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "product_owner",
                columns: [
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "product_id",
                        type: "uuid",
                    },
                ],

                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        name: "fk_user",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        columnNames: ["product_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "products",
                        name: "fk_products",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("product_owner");
    }

}
