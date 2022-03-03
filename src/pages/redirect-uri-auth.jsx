import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';

import SECRET_KEY from '../../static/secretKey';
import { userService } from '../services';
import { updateAccessToken, updateInfoUser } from '../reducers/auth';
import { ACCESS_TOKEN } from '../constants';

class RedirectUriAuth extends React.Component {
    async componentDidMount() {
        if (this.props.location.search) {
            const jwtParam = Object.fromEntries(
                new URLSearchParams(this.props.location.search),
            );
            const jwtDecode = jwt.verify(jwtParam.state, SECRET_KEY);
            if (jwtDecode.token) {
                this.props.updateAccessToken(jwtDecode.token);
                localStorage.setItem(ACCESS_TOKEN, jwtDecode.token);
                const res = await userService.getUserInfo();
                if (res.code === 200 && res.data) {
                    this.props.updateInfoUser(res.data);
                }
            }
        }
        this.props.history.push('/');
    }
    render() {
        return <div></div>;
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    updateAccessToken: accessToken => dispatch(updateAccessToken(accessToken)),
    updateInfoUser: userInfo => dispatch(updateInfoUser(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RedirectUriAuth);
