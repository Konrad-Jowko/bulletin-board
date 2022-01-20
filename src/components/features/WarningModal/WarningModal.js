import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import {getAlert} from '../../../redux/postsRedux.js';
import styles from './WarningModal.module.scss';

/* MODAL COMPONENT DISPLAYING ALERTS */
const Component = (props) => {
  if (props.alert === true) {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <SentimentVeryDissatisfiedRoundedIcon className={styles.icon}/>
          <h2>Some of the given input is empty or wrong! Please check the highlighted elements. </h2>
          <Button className={styles.button} size='large' onClick={props.givenFunction}>
              Close
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

Component.propTypes = {
  alert: PropTypes.bool,
  givenFunction: PropTypes.func,
};

const mapStateToProps = state => ({
  alert: getAlert(state),
});

const Container = connect(mapStateToProps)(Component);

export default Container;
