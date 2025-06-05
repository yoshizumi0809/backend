import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdAndName1749103780944 implements MigrationInterface {
    name = 'AddUserIdAndName1749103780944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`user_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_758b8ce7c18b9d347461b30228\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`user_id\``);
    }

}
