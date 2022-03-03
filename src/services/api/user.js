import {USER_INFO_URL} from '../api-url';
import {uCodeService} from '../config';

export const userService = {
    getUserInfo: () => {
        return uCodeService.get(USER_INFO_URL);
    },
};

export default userService;
