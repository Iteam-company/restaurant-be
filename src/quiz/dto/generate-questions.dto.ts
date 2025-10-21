import { ApiProperty } from '@nestjs/swagger';
import { Question } from 'src/types/entity/question.entity';

class GenerateQuestionsDto {
  @ApiProperty({
    description: 'Array of files as data for ai to generate questions',
  })
  files: Express.Multer.File[];

  @ApiProperty({ description: 'Search by restaurant', required: false })
  prompt?: string;

  @ApiProperty({
    description: 'Count of quizzes(by default 5)',
    required: false,
    example: 5,
  })
  count?: number;

  @ApiProperty({
    isArray: true,
    description:
      'Previous question based on this ai should not generate same questions',
    required: false,
    example: `
[
  {
   "id":1,
   "text":"Які інгредієнти входять до складу коктейлю «Long Island Ice Tea»?",
   "variants":[
      "Ром Captain Morgan White",
      "Джин Gordon's London Dry",
      "Текіла Jarana Blanco",
      "Горілка Rada Premium",
      "Вермут Cinzano Rosso",
      "Coca-Cola"
   ],
   "correct":[
      0,
      1,
      2,
      3,
      5
   ],
   "multipleCorrect":true
  },
  {
    "id":2,
    "text":"Який вихід має фреш апельсиновий?",
    "variants":[
        "100",
        "150",
        "200",
        "250"
    ],
    "correct":[
        2
    ],
    "multipleCorrect":false
  }
]`,
  })
  previousQuestions?: Array<Question>;
}

export default GenerateQuestionsDto;
