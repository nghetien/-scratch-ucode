/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AccountNavComponent from '../components/menu-bar/account-nav.jsx';

const AccountNav = function (props) {
    const { ...componentProps } = props;
    return <AccountNavComponent {...componentProps} />;
};

AccountNav.propTypes = {
    isRtl: PropTypes.bool,
    profileUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    email: PropTypes.string,
};

const mapStateToProps = state => ({
    profileUrl: `${process.env.DOMAIN_REDIRECT}/personal-information/`,
    thumbnailUrl:
        state.auth && state.auth.infoUser && state.auth.infoUser.avatar
            ? state.auth.infoUser.avatar
            : null,
    email:
        state.auth && state.auth.infoUser && state.auth.infoUser.email
            ? state.auth.infoUser.email
            : '',
});

const mapDispatchToProps = () => ({});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AccountNav),
);
