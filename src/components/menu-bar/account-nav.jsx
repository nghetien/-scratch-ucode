/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuSection } from '../menu/menu.jsx';
import MenuItemContainer from '../../containers/menu-item.jsx';
import UserAvatar from './user-avatar.jsx';
import dropdownCaret from './dropdown-caret.svg';

import styles from './account-nav.css';

const AccountNavComponent = ({
    className,
    isOpen,
    isRtl,
    menuBarMenuClassName,
    onClick,
    onClose,
    onLogOut,
    profileUrl,
    thumbnailUrl,
    email,
}) => (
    <React.Fragment>
        <div
            className={classNames(styles.userInfo, className)}
            onMouseUp={onClick}
        >
            {thumbnailUrl ? (
                <UserAvatar className={styles.avatar} imageUrl={thumbnailUrl} />
            ) : null}
            <span className={styles.profileName}>{email}</span>
            <div className={styles.dropdownCaretPosition}>
                <img className={styles.dropdownCaretIcon} src={dropdownCaret} />
            </div>
        </div>
        <MenuBarMenu
            className={menuBarMenuClassName}
            open={isOpen}
            // note: the Rtl styles are switched here, because this menu is justified
            // opposite all the others
            place={isRtl ? 'right' : 'left'}
            onRequestClose={onClose}
        >
            <MenuItemContainer href={profileUrl}>
                <FormattedMessage
                    defaultMessage="Profile"
                    description="Text to link to my user profile, in the account navigation menu"
                    id="gui.accountMenu.profile"
                />
            </MenuItemContainer>
            <MenuSection>
                <MenuItemContainer onClick={onLogOut}>
                    <FormattedMessage
                        defaultMessage="Sign out"
                        description="Text to link to sign out, in the account navigation menu"
                        id="gui.accountMenu.signOut"
                    />
                </MenuItemContainer>
            </MenuSection>
        </MenuBarMenu>
    </React.Fragment>
);

AccountNavComponent.propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    menuBarMenuClassName: PropTypes.string,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    onLogOut: PropTypes.func,
    profileUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    email: PropTypes.string,
};

export default AccountNavComponent;
