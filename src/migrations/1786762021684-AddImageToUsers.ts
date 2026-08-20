import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToUsers1786762021684 implements MigrationInterface {
  name = 'AddImageToUsers1786762021684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "image" bytea
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "image"
    `);
  }
}
