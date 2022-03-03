import { DRAFT_URL } from '../api-url';
import { uCodeService } from '../config';

export const draftService = {
    getDraft: params => {
        return uCodeService.get(DRAFT_URL, { params });
    },
    saveDraft: data => {
        return uCodeService.post(DRAFT_URL, data);
    },
};

export default draftService;
