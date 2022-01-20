import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import styles from './NotFound.module.scss';

/* NOT FOUND COMPONENT */
const Component = () => (
  <div className={styles.root}>
    <div className={styles.container}>
      <SentimentVeryDissatisfiedRoundedIcon className={styles.icon}/>
      <h2>Sorry, page not found!</h2>
      <NavLink to='/'>
        <Button className={styles.button} size='large'>
          Back to  Homepage
        </Button>
      </NavLink>
    </div>
  </div>
);

Component.propTypes = {
  children: PropTypes.node,
};

export { Component as NotFound };
