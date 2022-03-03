const UPDATE_ACCESS_TOKEN = 'scratch-gui/auth/UPDATE_ACCESS_TOKEN';
const UPDATE_INFO_USER = 'scratch-gui/auth/UPDATE_INFO_USER';

const updateAccessToken = accessToken => ({
    type: UPDATE_ACCESS_TOKEN,
    accessToken,
});

const updateInfoUser = infoUser => ({
    type: UPDATE_INFO_USER,
    infoUser,
});

const initialState = {
    accessToken: '',
    infoUser: {},
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case UPDATE_ACCESS_TOKEN:
            return Object.assign({}, state, {
                accessToken: action.accessToken,
            });
        case UPDATE_INFO_USER:
            return Object.assign({}, state, {
                infoUser: action.infoUser,
            });
        default:
            return state;
    }
};

export {
    reducer as default,
    initialState as authInitialState,
    updateAccessToken,
    updateInfoUser,
};
