import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIDProductTable1622314103480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("product_owner", new TableColumn(
            {
                name: "id",
                type: "uuid",
                isPrimary: true,
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("product_owner", "id");
    }

}
