import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserGate1684238274282 implements MigrationInterface {
  name = 'UserGate1684238274282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE public.member_devices_enum AS ENUM ('GarminWatch', 'AppleWatch', 'WhoopStrap', 'OuraRing');`,
    );
    await queryRunner.query(
      `CREATE TYPE public.member_goal_enum AS ENUM ('Longevity', 'WeightLoss', 'LifestyleTracking', 'Education');`,
    );
    await queryRunner.query(
      `CREATE TYPE public.user_createdby_enum AS ENUM ('Member', 'Admin');`,
    );
    await queryRunner.query(
      `CREATE TYPE public.user_status_enum AS ENUM ('NotVerified', 'Active', 'InActive', 'Deleted');`,
    );
    await queryRunner.query(
      `CREATE TABLE "member" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "details" jsonb NOT NULL DEFAULT '{}', "goal" "public"."member_goal_enum" NOT NULL DEFAULT 'Longevity', "devices" "public"."member_devices_enum" array NOT NULL DEFAULT '{}', "appToken" jsonb NOT NULL DEFAULT '{}', "preferences" jsonb NOT NULL DEFAULT '{}', "membership" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "REL_08897b166dee565859b7fb2fcc" UNIQUE ("userId"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "details" jsonb NOT NULL DEFAULT '{}', "preferences" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "REL_f8a889c4362d78f056960ca6da" UNIQUE ("userId"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(50) NOT NULL DEFAULT '', "lastName" character varying(50) NOT NULL DEFAULT '', "email" character varying(100) NOT NULL, "username" character varying, "password" character varying(100) NOT NULL DEFAULT '', "country" character varying(50) NOT NULL DEFAULT '', "verificationCodes" jsonb, "status" "public"."user_status_enum" NOT NULL DEFAULT 'NotVerified', "photo" character varying(255), "refreshToken" character varying, "createdBy" "public"."user_createdby_enum" NOT NULL DEFAULT 'Member', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_08897b166dee565859b7fb2fcc8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" ADD CONSTRAINT "FK_f8a889c4362d78f056960ca6dad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin" DROP CONSTRAINT "FK_f8a889c4362d78f056960ca6dad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_08897b166dee565859b7fb2fcc8"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TYPE public.user_status_enum`);
    await queryRunner.query(`DROP TYPE public.user_createdby_enum`);
    await queryRunner.query(`DROP TYPE public.member_goal_enum`);
    await queryRunner.query(`DROP TYPE public.member_devices_enum`);
  }
}
