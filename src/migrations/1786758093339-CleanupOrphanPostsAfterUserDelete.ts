import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupOrphanPostsAfterUserDelete1786758093339 implements MigrationInterface {
  name = 'CleanupOrphanPostsAfterUserDelete1786758093339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "post_views"
      WHERE "post_id" IN (
        SELECT "id" FROM "posts" WHERE "user_id" IS NULL
      )
    `);

    await queryRunner.query(`
      DELETE FROM "posts"
      WHERE "user_id" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" ALTER COLUMN "user_id" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" ALTER COLUMN "user_id" DROP NOT NULL
    `);
  }
}
