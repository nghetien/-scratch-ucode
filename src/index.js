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
import CurrentQuestionReducer, {
    currentQuestionInitialState,
} from './reducers/current-question';
import { ScratchPaintReducer } from 'scratch-paint';
import { setFullScreen, setPlayer } from './reducers/mode';
import { remixProject } from './reducers/project-state';
import { setAppElement } from 'react-modal';

const guiReducers = {
    auth: AuthReducer,
    currentQuestion: CurrentQuestionReducer,
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
    currentQuestionInitialState,
    localesInitialState,
    remixProject,
    setFullScreen,
    setPlayer,
};
