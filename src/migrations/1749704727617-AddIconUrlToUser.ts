import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIconUrlToUser1749704727617 implements MigrationInterface {
    name = 'AddIconUrlToUser1749704727617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`icon_url\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`icon_url\``);
    }

}
