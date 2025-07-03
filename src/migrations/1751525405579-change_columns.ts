import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumns1751525405579 implements MigrationInterface {
    name = 'ChangeColumns1751525405579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_dea1292c6882b56142e9d6f9a9\` (\`login_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_dea1292c6882b56142e9d6f9a9\``);
    }

}
