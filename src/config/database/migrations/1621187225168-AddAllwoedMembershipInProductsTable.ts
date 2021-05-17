import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddAlwoedMembershipInProductsTable1621187225168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn(
            {
                name: "allowed_membership",
                type: "boolean",
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "allowed_membership");
    }

}
