import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose } from 'redux';
import { Route, Switch } from 'react-router-dom';
import locales from 'scratch-l10n';

import ConnectedIntlProvider from './connected-intl-provider.jsx';
import localesReducer, {
    initLocale,
    localesInitialState,
} from '../reducers/locales';
import authReducer, {
    authInitialState,
    updateAccessToken,
    updateInfoUser,
} from '../reducers/auth';
import { setPlayer, setFullScreen } from '../reducers/mode.js';
import { detectLocale } from './detect-locale';
import RedirectUriAuth from '../pages/redirect-uri-auth.jsx';
import { ACCESS_TOKEN } from '../constants';
import { userService } from '../services';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// eslint-disable-next-line import/no-mutable-exports
let mainStore;

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @param {boolean} localesOnly - only provide the locale state, not everything
 *                      required by the GUI. Used to exclude excess state when
                        only rendering modals, not the GUI.
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent, localesOnly) {
    class AppStateWrapper extends React.Component {
        constructor(props) {
            super(props);
            let initialState = {};
            let reducers = {};
            let enhancer;

            let initializedLocales = localesInitialState;
            const locale = detectLocale(Object.keys(locales));
            if (locale !== 'en') {
                initializedLocales = initLocale(initializedLocales, locale);
            }
            if (localesOnly) {
                // Used for instantiating minimal state for the unsupported
                // browser modal
                reducers = { locales: localesReducer };
                initialState = { locales: initializedLocales };
                enhancer = composeEnhancers();
            } else {
                // You are right, this is gross. But it's necessary to avoid
                // importing unneeded code that will crash unsupported browsers.
                const guiRedux = require('../reducers/gui');
                const guiReducer = guiRedux.default;
                const {
                    guiInitialState,
                    guiMiddleware,
                    initFullScreen,
                    initPlayer,
                    initTelemetryModal,
                } = guiRedux;
                const { ScratchPaintReducer } = require('scratch-paint');

                let initializedGui = guiInitialState;
                if (props.isFullScreen || props.isPlayerOnly) {
                    if (props.isFullScreen) {
                        initializedGui = initFullScreen(initializedGui);
                    }
                    if (props.isPlayerOnly) {
                        initializedGui = initPlayer(initializedGui);
                    }
                } else if (props.showTelemetryModal) {
                    initializedGui = initTelemetryModal(initializedGui);
                }
                reducers = {
                    auth: authReducer,
                    locales: localesReducer,
                    scratchGui: guiReducer,
                    scratchPaint: ScratchPaintReducer,
                };
                initialState = {
                    auth: authInitialState,
                    locales: initializedLocales,
                    scratchGui: initializedGui,
                };
                enhancer = composeEnhancers(guiMiddleware);
            }
            const reducer = combineReducers(reducers);
            this.store = createStore(reducer, initialState, enhancer);
            mainStore = this.store;
        }
        async componentDidMount() {
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            if (accessToken) {
                this.store.dispatch(updateAccessToken(accessToken));
                const res = await userService.getUserInfo();
                if (res.code === 200 && res.data) {
                    this.store.dispatch(updateInfoUser(res.data));
                }
            }
        }
        componentDidUpdate(prevProps) {
            if (localesOnly) return;
            if (prevProps.isPlayerOnly !== this.props.isPlayerOnly) {
                this.store.dispatch(setPlayer(this.props.isPlayerOnly));
            }
            if (prevProps.isFullScreen !== this.props.isFullScreen) {
                this.store.dispatch(setFullScreen(this.props.isFullScreen));
            }
        }
        render() {
            const {
                isFullScreen, // eslint-disable-line no-unused-vars
                isPlayerOnly, // eslint-disable-line no-unused-vars
                showTelemetryModal, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            return (
                <Provider store={this.store}>
                    <ConnectedIntlProvider>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                component={() => (
                                    <WrappedComponent {...componentProps} />
                                )}
                            />
                            <Route
                                exact
                                path="/redirect-uri"
                                component={RedirectUriAuth}
                            />
                            <Route
                                path="*"
                                component={() => <h1>Page not found</h1>}
                            />
                        </Switch>
                    </ConnectedIntlProvider>
                </Provider>
            );
        }
    }
    AppStateWrapper.propTypes = {
        isFullScreen: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        isTelemetryEnabled: PropTypes.bool,
        showTelemetryModal: PropTypes.bool,
    };
    return AppStateWrapper;
};

export { AppStateHOC as default, mainStore };
