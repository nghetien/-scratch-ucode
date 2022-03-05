import { UPLOAD_FILE_URL } from '../api-url';
import { uCodeService } from '../config';

export const uploadFileService = {
    uploadFile: dataFromUpload => {
        return uCodeService.post(UPLOAD_FILE_URL, dataFromUpload);
    },
};

export default uploadFileService;
