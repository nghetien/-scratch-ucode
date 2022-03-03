import { GET_USER_INFO } from '../api-url';
import { uCodeService } from '../config';

export const userService = {
    getUserInfo: () => {
        return uCodeService.get(GET_USER_INFO);
    },
};

export default userService;
