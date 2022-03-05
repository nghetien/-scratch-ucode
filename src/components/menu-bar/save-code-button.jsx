import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import StatusSaving from '../../constants/status-save';
import styles from './save-status.css';

const SaveCodeButton = ({ onClick, isSaving }) =>
    isSaving === StatusSaving.IS_LOADING ? (
        <div className={styles.saveNow}>
            <FormattedMessage
                defaultMessage="Saving project..."
                description="Title bar link for saving project"
                id="gui.menuBar.savingProject"
            />
        </div>
    ) : isSaving === StatusSaving.NORMAL ? (
        <div className={styles.saveNow} onClick={onClick}>
            <FormattedMessage
                defaultMessage="Save Now"
                description="Title bar link for saving now"
                id="gui.menuBar.saveNowLink"
            />
        </div>
    ) : (
        <div className={styles.saved}>
            <FormattedMessage
                defaultMessage="Project saved"
                description="Title bar link for project saved"
                id="gui.menuBar.projectSaved"
            />
        </div>
    );

SaveCodeButton.propTypes = {
    onClick: PropTypes.func,
    isSaving: PropTypes.string,
};

SaveCodeButton.defaultProps = {
    onClick: () => {},
    isSaving: false,
};

export default SaveCodeButton;
