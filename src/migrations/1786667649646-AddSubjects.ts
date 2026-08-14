import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubjects1786667649646 implements MigrationInterface {
  name = 'AddSubjects1786667649646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "subjects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nome" character varying NOT NULL,
        CONSTRAINT "UQ_subjects_nome" UNIQUE ("nome"),
        CONSTRAINT "PK_subjects_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "subjects" ("nome")
      VALUES
        ('Geral'),
        ('Português'),
        ('Matemática'),
        ('Geografia'),
        ('História'),
        ('Ciências'),
        ('Ensino Religioso')
      ON CONFLICT ("nome") DO NOTHING
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD "image" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD "subject_id" uuid
    `);

    await queryRunner.query(`
      UPDATE "posts"
      SET "subject_id" = (
        SELECT "id"
        FROM "subjects"
        WHERE "nome" = 'Geral'
        LIMIT 1
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ALTER COLUMN "subject_id" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_posts_subject_id"
      FOREIGN KEY ("subject_id") REFERENCES "subjects"("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_subject_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" DROP COLUMN "subject_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" DROP COLUMN "image"
    `);

    await queryRunner.query(`
      DROP TABLE "subjects"
    `);
  }
}