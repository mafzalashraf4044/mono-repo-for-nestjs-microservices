import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserGate1686142170259 implements MigrationInterface {
  name = 'UserGate1686142170259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passwordless_access_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "totalLimit" integer NOT NULL, "usedLimit" integer NOT NULL DEFAULT '0', "token" character varying(50) NOT NULL, "expiration" TIMESTAMP NOT NULL, CONSTRAINT "UQ_f7ea32e9d70d65b19714f675110" UNIQUE ("token"), CONSTRAINT "PK_b0ad5eda1db0b04ec3b95b2f014" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwordless_access_token" ADD CONSTRAINT "FK_3ce7deca174ac0240d0545a125e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passwordless_access_token" DROP CONSTRAINT "FK_3ce7deca174ac0240d0545a125e"`,
    );
    await queryRunner.query(`DROP TABLE "passwordless_access_token"`);
  }
}
