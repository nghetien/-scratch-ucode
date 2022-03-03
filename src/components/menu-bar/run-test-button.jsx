import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './run-test-button.css';

const RunTestButton = ({ className, onClick }) => (
    <Button
        className={classNames(className, styles.runTestButton)}
        onClick={onClick}
    >
        <i
            className={classNames('fa-solid', 'fa-terminal', styles.iconTest)}
        ></i>
        <FormattedMessage
            defaultMessage="Run test"
            description="Run test"
            id="gui.menuBar.runTest"
        />
    </Button>
);

RunTestButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

RunTestButton.defaultProps = {
    onClick: () => {},
};

export default RunTestButton;
