import { MigrationInterface, QueryRunner } from "typeorm";

export class PostEPostView1781746779920 implements MigrationInterface {
    name = 'PostEPostView1781746779920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "viewed_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "UQ_bdd913c20f02e4998fb02070421" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_c2a8a36a99453e5ac5ddf15cbf7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying NOT NULL, "descricao" character varying NOT NULL, "conteudo" text NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "data_modificacao" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_views" ADD CONSTRAINT "FK_2fc8eaeff26cd888e2b54c0c283" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_views" ADD CONSTRAINT "FK_c7df0096dacc9106dabf85b75cd" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "post_views" DROP CONSTRAINT "FK_c7df0096dacc9106dabf85b75cd"`);
        await queryRunner.query(`ALTER TABLE "post_views" DROP CONSTRAINT "FK_2fc8eaeff26cd888e2b54c0c283"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "post_views"`);
    }

}
