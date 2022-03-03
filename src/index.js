import GUI from './containers/gui.jsx';
import AppStateHOC from './lib/app-state-hoc.jsx';
import GuiReducer, {
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initFullScreen,
    initPlayer,
} from './reducers/gui';
import LocalesReducer, {
    localesInitialState,
    initLocale,
} from './reducers/locales';
import AuthReducer, { authInitialState } from './reducers/auth';
import { ScratchPaintReducer } from 'scratch-paint';
import { setFullScreen, setPlayer } from './reducers/mode';
import { remixProject } from './reducers/project-state';
import { setAppElement } from 'react-modal';

const guiReducers = {
    auth: AuthReducer,
    locales: LocalesReducer,
    scratchGui: GuiReducer,
    scratchPaint: ScratchPaintReducer,
};

export {
    GUI as default,
    AppStateHOC,
    setAppElement,
    guiReducers,
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initPlayer,
    initFullScreen,
    initLocale,
    authInitialState,
    localesInitialState,
    remixProject,
    setFullScreen,
    setPlayer,
};
