import axios from 'axios';
import { mainStore } from '../lib/app-state-hoc.jsx';

const CONFIG_DATA_RESPONSE = res => ({
    code: res && res.data.error_code === 0 ? 200 : res.data.error_code,
    success: res && res.data && res.data.success ? res.data.success : false,
    message: res && res.data && res.data.message ? res.data.message : '',
    data: res && res.data && res.data.data ? res.data.data : {},
});

export const uCodeService = axios.create({
    baseURL: process.env.API_URL,
});

const requestInterceptor = request => {
    const token =
        mainStore.getState() &&
        mainStore.getState().auth &&
        mainStore.getState().auth.accessToken;
    if (token) request.headers['access-token'] = token;
    return request;
};
const responseSuccessInterceptor = response => {
    return CONFIG_DATA_RESPONSE(response);
};
const responseErrorInterceptor = error => {
    return Promise.reject(error);
};

uCodeService.interceptors.request.use(requestInterceptor);
uCodeService.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor,
);
