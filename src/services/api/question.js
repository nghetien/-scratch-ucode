import {QUESTION_URL} from '../api-url';
import {uCodeService} from '../config';

export const questionService = {
    getQuestionInfo: questionId => {
        return uCodeService.get(QUESTION_URL + questionId);
    },
};

export default questionService;
