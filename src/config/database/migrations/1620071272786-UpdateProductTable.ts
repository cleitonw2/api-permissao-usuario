import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UpdateProductTable1620071272786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn({
            name: "commission_by_sales",
            type: "numeric",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "commission_by_sales");
    }

}
