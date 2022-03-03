import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './submit-code-button.css';

const SubmitCodeButton = ({className, onClick}) => (
    <Button
        className={classNames(className, styles.submitCodeButton)}
        onClick={onClick}
    >
        <i className={classNames('fa-solid', 'fa-code', styles.iconSubmit)}></i>
        <FormattedMessage
            defaultMessage="Submit code"
            description="Submit code"
            id="gui.menuBar.submitCode"
        />
    </Button>
);

SubmitCodeButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

SubmitCodeButton.defaultProps = {
    onClick: () => {
    },
};

export default SubmitCodeButton;
