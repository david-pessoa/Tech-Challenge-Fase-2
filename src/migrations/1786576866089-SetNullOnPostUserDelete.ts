import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNullOnPostUserDelete1786576866089 implements MigrationInterface {
  name = 'SetNullOnPostUserDelete1786576866089';
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" ALTER COLUMN "user_id" DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" ALTER COLUMN "user_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE
    `);
  }
}