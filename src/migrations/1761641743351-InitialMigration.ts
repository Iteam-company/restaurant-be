import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1761641743351 implements MigrationInterface {
    name = 'InitialMigration1761641743351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "variants" text array NOT NULL, "correct" integer array NOT NULL, "multipleCorrect" boolean NOT NULL, "quizId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_result" ("id" SERIAL NOT NULL, "score" character varying NOT NULL, "ratingDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "quizId" integer, CONSTRAINT "PK_87b85729df5cb6f6e136daeea4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "difficultyLevel" character varying NOT NULL, "timeLimit" integer NOT NULL, "status" character varying NOT NULL, "restaurantId" integer, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "image" character varying, "ownerId" integer, CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "role" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "password" character varying NOT NULL, "icon" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_summary" ("id" SERIAL NOT NULL, "bestScore" character varying NOT NULL, "endDate" TIMESTAMP NOT NULL, "duration" character varying NOT NULL, "quizId" integer, CONSTRAINT "REL_faffc007e698d9883028174bfb" UNIQUE ("quizId"), CONSTRAINT "PK_ba64b9e2d61bfada26fc62931ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant_workers" ("restaurant_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_c4ebe57260894df8b346e75b69a" PRIMARY KEY ("restaurant_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0a6bbde1f70977dff14b00cb6d" ON "restaurant_workers" ("restaurant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_21eda58555124a5a5949ad0fbf" ON "restaurant_workers" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "restaurant_admins" ("restaurant_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_8cd4bc1a8e8a26de21bc97ba94f" PRIMARY KEY ("restaurant_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f60413d339b0ceeda027c8a08a" ON "restaurant_admins" ("restaurant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_010f0060d89ed437ed0f66a001" ON "restaurant_admins" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "quiz_summary_members_user" ("quizSummaryId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_dfadc0b8030f8d5157c08de23d0" PRIMARY KEY ("quizSummaryId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8e39a9afc3b4f2946d2e3b710a" ON "quiz_summary_members_user" ("quizSummaryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1961859e608e5e1669d93b57df" ON "quiz_summary_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_4abf6cd9299375deb44f23f170a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD CONSTRAINT "FK_d74fa9a645a58d00710494b8f88" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_315af20ce2dd3e52d28fba79fab" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_summary" ADD CONSTRAINT "FK_faffc007e698d9883028174bfbe" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant_workers" ADD CONSTRAINT "FK_0a6bbde1f70977dff14b00cb6d4" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_workers" ADD CONSTRAINT "FK_21eda58555124a5a5949ad0fbf0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant_admins" ADD CONSTRAINT "FK_f60413d339b0ceeda027c8a08a4" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_admins" ADD CONSTRAINT "FK_010f0060d89ed437ed0f66a0011" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_summary_members_user" ADD CONSTRAINT "FK_8e39a9afc3b4f2946d2e3b710a4" FOREIGN KEY ("quizSummaryId") REFERENCES "quiz_summary"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_summary_members_user" ADD CONSTRAINT "FK_1961859e608e5e1669d93b57df9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_summary_members_user" DROP CONSTRAINT "FK_1961859e608e5e1669d93b57df9"`);
        await queryRunner.query(`ALTER TABLE "quiz_summary_members_user" DROP CONSTRAINT "FK_8e39a9afc3b4f2946d2e3b710a4"`);
        await queryRunner.query(`ALTER TABLE "restaurant_admins" DROP CONSTRAINT "FK_010f0060d89ed437ed0f66a0011"`);
        await queryRunner.query(`ALTER TABLE "restaurant_admins" DROP CONSTRAINT "FK_f60413d339b0ceeda027c8a08a4"`);
        await queryRunner.query(`ALTER TABLE "restaurant_workers" DROP CONSTRAINT "FK_21eda58555124a5a5949ad0fbf0"`);
        await queryRunner.query(`ALTER TABLE "restaurant_workers" DROP CONSTRAINT "FK_0a6bbde1f70977dff14b00cb6d4"`);
        await queryRunner.query(`ALTER TABLE "quiz_summary" DROP CONSTRAINT "FK_faffc007e698d9883028174bfbe"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_315af20ce2dd3e52d28fba79fab"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_d74fa9a645a58d00710494b8f88"`);
        await queryRunner.query(`ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88"`);
        await queryRunner.query(`ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_4abf6cd9299375deb44f23f170a"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1961859e608e5e1669d93b57df"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e39a9afc3b4f2946d2e3b710a"`);
        await queryRunner.query(`DROP TABLE "quiz_summary_members_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_010f0060d89ed437ed0f66a001"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f60413d339b0ceeda027c8a08a"`);
        await queryRunner.query(`DROP TABLE "restaurant_admins"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21eda58555124a5a5949ad0fbf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a6bbde1f70977dff14b00cb6d"`);
        await queryRunner.query(`DROP TABLE "restaurant_workers"`);
        await queryRunner.query(`DROP TABLE "quiz_summary"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "restaurant"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "quiz_result"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
