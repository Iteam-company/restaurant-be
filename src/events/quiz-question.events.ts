import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class QuizQuestionEvents {
  constructor(private eventEmitter: EventEmitter2) {}

  async removeQuestion(questionId: number) {
    await this.eventEmitter.emit('question.remove', {
      questionId,
    });
  }
}
