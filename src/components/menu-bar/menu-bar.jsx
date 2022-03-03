import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import bowser from 'bowser';
import React from 'react';
import jwt from 'jsonwebtoken';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ShareButton from './share-button.jsx';
import LoginButton from './login-button.jsx';
import RunTestButton from './run-test-button.jsx';
import SubmitCodeButton from './submit-code-button.jsx';
import SaveCodeButton from './save-code-button.jsx';
import { ComingSoonTooltip } from '../coming-soon/coming-soon.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import SaveStatus from './save-status.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuItem, MenuSection } from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';
import MenuBarHOC from '../../containers/menu-bar-hoc.jsx';
import { setPlayer } from '../../reducers/mode';
import {
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    saveProjectAsCopy,
} from '../../reducers/project-state';
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    loginMenuOpen,
} from '../../reducers/menus';
import collectMetadata from '../../lib/collect-metadata';
import styles from './menu-bar.css';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';
import aboutIcon from './icon--about.svg';
import scratchLogo from './scratch-logo.svg';
import sharedMessages from '../../lib/shared-messages';
import SECRET_KEY from '../../../static/secretKey';
import { updateAccessToken, updateInfoUser } from '../../reducers/auth';
import { ACCESS_TOKEN } from '../../constants';
import draftService from '../../services/api/draft';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu',
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button',
    },
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom',
}) => {
    if (enable) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool,
};

const AboutButton = props => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClickNew',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickShare',
            'handleKeyPress',
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'getSaveToComputerHandler',
            'restoreOptionMessage',
            'handleClickLogout',
        ]);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleClickNew() {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning),
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew,
            );
        }
        this.props.onRequestCloseFile();
    }
    async handleClickSave() {
        await this.saveDraft();
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    async saveDraft() {
        const res = await draftService.saveDraft({
            key: this.props.keyDraft,
            value: JSON.stringify(this.props.projectData),
        });
        if (res.success) {
            console.log(res.data);
        }
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickShare(waitForUpdate) {
        console.log(waitForUpdate);
        // TODO
        // if (!this.props.isShared) {
        //     console.log(waitForUpdate);
        //     if (this.props.canShare) {
        //         // save before transitioning to project page
        //         this.props.onShare();
        //     }
        //     if (this.props.canSave) {
        //         console.log(3);
        //         // save before transitioning to project page
        //         this.props.autoUpdateProject();
        //         waitForUpdate(true); // queue the transition to project page
        //     } else {
        //         console.log(4);
        //         waitForUpdate(false); // immediately transition to project page
        //     }
        // }
    }
    handleClickLogin() {
        const dataHash = {
            uri: window.location.origin,
            redirectPath: undefined,
            tenantId: undefined,
            mode: 'sign-in',
            affiliate: undefined,
        };
        const token = jwt.sign(dataHash, SECRET_KEY);
        window.location = `${process.env.ID_UCODE}/?state=${token}`;
    }
    handleClickRunTest() {}
    handleClickSubmitCode() {}
    handleClickLogout() {
        localStorage.setItem(ACCESS_TOKEN, '');
        this.props.updateAccessToken('');
        this.props.updateInfoUser({});
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(
                    this.props.vm,
                    this.props.projectTitle,
                    this.props.locale,
                );
                this.props.onProjectTelemetryEvent('projectDidSave', metadata);
            }
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case 'Sprite':
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sprite"
                        description="Menu bar item for restoring the last deleted sprite."
                        id="gui.menuBar.restoreSprite"
                    />
                );
            case 'Sound':
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sound"
                        description="Menu bar item for restoring the last deleted sound."
                        id="gui.menuBar.restoreSound"
                    />
                );
            case 'Costume':
                return (
                    <FormattedMessage
                        defaultMessage="Restore Costume"
                        description="Menu bar item for restoring the last deleted costume."
                        id="gui.menuBar.restoreCostume"
                    />
                );
            default: {
                return (
                    <FormattedMessage
                        defaultMessage="Restore"
                        description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                        id="gui.menuBar.restore"
                    />
                );
            }
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === 'function') {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen,
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img className={styles.aboutIcon} src={aboutIcon} />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? 'right' : 'left'}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {onClickAbout.map(itemProps => (
                        <MenuItem
                            key={itemProps.title}
                            isRtl={this.props.isRtl}
                            onClick={this.wrapAboutMenuCallback(
                                itemProps.onClick,
                            )}
                        >
                            {itemProps.title}
                        </MenuItem>
                    ))}
                </MenuBarMenu>
            </div>
        );
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    render() {
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );

        // Show the About button only if we have a handler for it (like in the desktop app)
        const aboutButton = this.buildAboutMenu(this.props.onClickAbout);
        return (
            <Box className={classNames(this.props.className, styles.menuBar)}>
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <img
                                alt="Scratch"
                                className={classNames(styles.scratchLogo, {
                                    [styles.clickable]:
                                        typeof this.props.onClickLogo !==
                                        'undefined',
                                })}
                                draggable={false}
                                src={this.props.logo}
                                onClick={this.props.onClickLogo}
                            />
                        </div>
                        {this.props.canChangeLanguage && (
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable,
                                    styles.languageMenu,
                                )}
                            >
                                <div>
                                    <img
                                        className={styles.languageIcon}
                                        src={languageIcon}
                                    />
                                    <img
                                        className={styles.languageCaret}
                                        src={dropdownCaret}
                                    />
                                </div>
                                <LanguageSelector
                                    label={this.props.intl.formatMessage(
                                        ariaMessages.language,
                                    )}
                                />
                            </div>
                        )}
                        {this.props.canManageFiles && (
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable,
                                    {
                                        [styles.active]:
                                            this.props.fileMenuOpen,
                                    },
                                )}
                                onMouseUp={this.props.onClickFile}
                            >
                                <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                />
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.fileMenuOpen}
                                    place={this.props.isRtl ? 'left' : 'right'}
                                    onRequestClose={
                                        this.props.onRequestCloseFile
                                    }
                                >
                                    <MenuSection>
                                        <MenuItem
                                            isRtl={this.props.isRtl}
                                            onClick={this.handleClickNew}
                                        >
                                            {newProjectMessage}
                                        </MenuItem>
                                    </MenuSection>
                                    <MenuSection>
                                        <MenuItem
                                            onClick={
                                                this.props
                                                    .onStartSelectingFileUpload
                                            }
                                        >
                                            {this.props.intl.formatMessage(
                                                sharedMessages.loadFromComputerTitle,
                                            )}
                                        </MenuItem>
                                        <SB3Downloader>
                                            {(
                                                className,
                                                downloadProjectCallback,
                                            ) => (
                                                <MenuItem
                                                    className={className}
                                                    onClick={this.getSaveToComputerHandler(
                                                        downloadProjectCallback,
                                                    )}
                                                >
                                                    <FormattedMessage
                                                        defaultMessage="Save to your computer"
                                                        description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                        id="gui.menuBar.downloadToComputer"
                                                    />
                                                </MenuItem>
                                            )}
                                        </SB3Downloader>
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        )}
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.editMenuOpen,
                                },
                            )}
                            onMouseUp={this.props.onClickEdit}
                        >
                            <div className={classNames(styles.editMenu)}>
                                <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                />
                            </div>
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.editMenuOpen}
                                place={this.props.isRtl ? 'left' : 'right'}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <DeletionRestorer>
                                    {(
                                        handleRestore,
                                        { restorable, deletedItem },
                                    ) => (
                                        <MenuItem
                                            className={classNames({
                                                [styles.disabled]: !restorable,
                                            })}
                                            onClick={this.handleRestoreOption(
                                                handleRestore,
                                            )}
                                        >
                                            {this.restoreOptionMessage(
                                                deletedItem,
                                            )}
                                        </MenuItem>
                                    )}
                                </DeletionRestorer>
                                <MenuSection>
                                    <TurboMode>
                                        {(toggleTurboMode, { turboMode }) => (
                                            <MenuItem onClick={toggleTurboMode}>
                                                {turboMode ? (
                                                    <FormattedMessage
                                                        defaultMessage="Turn off Turbo Mode"
                                                        description="Menu bar item for turning off turbo mode"
                                                        id="gui.menuBar.turboModeOff"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="Turn on Turbo Mode"
                                                        description="Menu bar item for turning on turbo mode"
                                                        id="gui.menuBar.turboModeOn"
                                                    />
                                                )}
                                            </MenuItem>
                                        )}
                                    </TurboMode>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.growable,
                        )}
                    >
                        <MenuBarItemTooltip enable id="title-field">
                            <ProjectTitleInput
                                className={classNames(
                                    styles.titleFieldGrowable,
                                )}
                            />
                        </MenuBarItemTooltip>
                    </div>
                    {this.props.accessTokenExists && this.props.emailUser ? (
                        <React.Fragment>
                            <div className={classNames(styles.menuBarItem)}>
                                <ProjectWatcher
                                    onDoneUpdating={this.props.onSeeCommunity}
                                >
                                    {waitForUpdate => (
                                        <ShareButton
                                            className={styles.menuBarButton}
                                            isShared={this.props.isShared}
                                            /* eslint-disable react/jsx-no-bind */
                                            onClick={() => {
                                                this.handleClickShare(
                                                    waitForUpdate,
                                                );
                                            }}
                                            /* eslint-enable react/jsx-no-bind */
                                        />
                                    )}
                                </ProjectWatcher>
                            </div>
                        </React.Fragment>
                    ) : null}
                </div>

                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                <div className={styles.accountInfoGroup}>
                    <div className={styles.menuBarItem}>
                        {this.props.canSave && <SaveStatus />}
                    </div>
                    {this.props.accessTokenExists && this.props.emailUser ? (
                        <React.Fragment>
                            <React.Fragment>
                                <SaveCodeButton
                                    onClick={() => {
                                        this.handleClickSave();
                                    }}
                                />
                                <SubmitCodeButton
                                    className={styles.menuBarButton}
                                    /* eslint-disable react/jsx-no-bind */
                                    onClick={() => {
                                        this.handleClickSubmitCode();
                                    }}
                                />
                                <RunTestButton
                                    className={styles.menuBarButton}
                                    /* eslint-disable react/jsx-no-bind */
                                    onClick={() => {
                                        this.handleClickRunTest();
                                    }}
                                />
                                <AccountNav
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        {
                                            [styles.active]:
                                                this.props.accountMenuOpen,
                                        },
                                    )}
                                    isOpen={this.props.accountMenuOpen}
                                    isRtl={this.props.isRtl}
                                    menuBarMenuClassName={classNames(
                                        styles.menuBarMenu,
                                    )}
                                    onClick={this.props.onClickAccount}
                                    onClose={this.props.onRequestCloseAccount}
                                    onLogOut={this.handleClickLogout}
                                />
                            </React.Fragment>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <LoginButton
                                className={styles.menuBarButton}
                                /* eslint-disable react/jsx-no-bind */
                                onClick={() => {
                                    this.handleClickLogin();
                                }}
                            />
                        </React.Fragment>
                    )}
                </div>

                {aboutButton}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    aboutMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canSave: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    logo: PropTypes.string,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf(
            // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func, // call this callback when the menu item is clicked
            }),
        ),
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    projectTitle: PropTypes.string,
    accessTokenExists: PropTypes.bool,
    emailUser: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => {},
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const accessToken = state.auth && state.auth.accessToken;
    const email =
        state.auth && state.auth.infoUser && state.auth.infoUser.email;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        accessTokenExists: accessToken ? accessToken.length !== 0 : false,
        emailUser: email ? email : null,
        vm: state.scratchGui.vm,
        projectData: state.scratchGui.projectState.projectData,
        keyDraft: state.currentQuestion.key,
    };
};

const mapDispatchToProps = dispatch => ({
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickNew: needSave => dispatch(requestNewProject(needSave)),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    updateAccessToken: accessToken => dispatch(updateAccessToken(accessToken)),
    updateInfoUser: userInfo => dispatch(updateInfoUser(userInfo)),
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps),
)(MenuBar);
