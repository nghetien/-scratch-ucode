import { GET_TENANT_INFO } from '../api-url';
import { uCodeService } from '../config';

export const userService = {
    getTenant: () => {
        return uCodeService.get(GET_TENANT_INFO);
    },
};

export default userService;
