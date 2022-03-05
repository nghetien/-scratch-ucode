import { CODE_QUESTION_URL } from '../api-url';
import { uCodeService } from '../config';

export const submitCodeService = {
    submitCodeQuestion: (questionId, dataSubmit) => {
        return uCodeService.post(
            `${CODE_QUESTION_URL}judge/${questionId}/submit-coding-question`,
            dataSubmit,
        );
    },
    submissionResult: submissionId => {
        return uCodeService.get(
            `${CODE_QUESTION_URL}judge-result/${submissionId}/submission_result`,
        );
    },
};

export default submitCodeService;
