import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761642024647 implements MigrationInterface {
    name = 'Migration1761642024647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_d74fa9a645a58d00710494b8f88"`);
        await queryRunner.query(`CREATE TABLE "restaurant_quizzes_quiz" ("restaurantId" integer NOT NULL, "quizId" integer NOT NULL, CONSTRAINT "PK_6a7dbee35d6be508cdacfb48413" PRIMARY KEY ("restaurantId", "quizId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3116d40d78c9d0cf3399a17335" ON "restaurant_quizzes_quiz" ("restaurantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a113920a538b4cf9d1c5284cb0" ON "restaurant_quizzes_quiz" ("quizId") `);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "restaurantId"`);
        await queryRunner.query(`ALTER TABLE "restaurant_quizzes_quiz" ADD CONSTRAINT "FK_3116d40d78c9d0cf3399a173355" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "restaurant_quizzes_quiz" ADD CONSTRAINT "FK_a113920a538b4cf9d1c5284cb03" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant_quizzes_quiz" DROP CONSTRAINT "FK_a113920a538b4cf9d1c5284cb03"`);
        await queryRunner.query(`ALTER TABLE "restaurant_quizzes_quiz" DROP CONSTRAINT "FK_3116d40d78c9d0cf3399a173355"`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD "restaurantId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a113920a538b4cf9d1c5284cb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3116d40d78c9d0cf3399a17335"`);
        await queryRunner.query(`DROP TABLE "restaurant_quizzes_quiz"`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD CONSTRAINT "FK_d74fa9a645a58d00710494b8f88" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
