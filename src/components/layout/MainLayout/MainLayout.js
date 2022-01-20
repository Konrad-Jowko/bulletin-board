import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../Header/Header';

import styles from './MainLayout.module.scss';

/* MAIN LAYOUT */
const Component = ({children}) => (
  <div className={styles.root}>
    <Header />
    {children}
  </div>
);

Component.propTypes = {
  children: PropTypes.node,
};

export {
  Component as MainLayout,
};
