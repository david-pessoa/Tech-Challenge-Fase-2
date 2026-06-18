import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781745332530 implements MigrationInterface {
    name = 'InitialSchema1781745332530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matricula" character varying NOT NULL, "nome" character varying NOT NULL, "senha" character varying NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "UQ_7d53fc05d1e07b20752d6a89ce6" UNIQUE ("matricula"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into("roles")
            .values([
                { nome: "ALUNO" },
                { nome: "PROFESSOR" },
                { nome: "ADMIN" },
            ])
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
