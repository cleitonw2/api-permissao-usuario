import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePermissionsRoles1614714703409 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "permissions_roles",
                columns: [
                    {
                        name: "role_id",
                        type: "uuid"
                    },
                    {
                        name: "permission_id",
                        type: "uuid"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["permission_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "permissions",
                        name: "fk_permissions_roles",
                        onDelete: "CASCADE",
                        onUpdate: "SET NULL",
                    },
                    {
                        columnNames: ["role_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "roles",
                        name: "fk_roles_permissions",
                        onDelete: "CASCADE",
                        onUpdate: "SET NULL",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("permissions_roles");
    }

}
