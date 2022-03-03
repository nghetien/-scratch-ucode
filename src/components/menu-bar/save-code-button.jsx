import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './save-status.css';

const SaveCodeButton = ({ onClick }) => (
    <div className={styles.saveNow} onClick={onClick}>
        <FormattedMessage
            defaultMessage="Save Now"
            description="Title bar link for saving now"
            id="gui.menuBar.saveNowLink"
        />
    </div>
);

SaveCodeButton.propTypes = {
    onClick: PropTypes.func,
};

SaveCodeButton.defaultProps = {
    onClick: () => {},
};

export default SaveCodeButton;
