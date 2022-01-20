import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
//import clsx from 'clsx';
import { connect } from 'react-redux';
import { getLogged, setModeAll, setModeOwned, manageLogin, getPhoto, deletePhoto} from '../../../redux/postsRedux.js';
import styles from './Header.module.scss';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

/* HEADER COMPONENT */
const Component = (props) => {

  // Download login data
  if(props.isLoggedIn === null) {
    props.manageLogin();
  }

  // Set global state to show all Posts
  const manageModeAll = (setModeAll, deletePhoto, photoName) => {
    setModeAll();
    deletePhoto(photoName);
  };

  // Set global state to show owned Posts
  const manageModeOwned = (setModeOwned, deletePhoto, photoName) => {
    setModeOwned();
    deletePhoto(photoName);
  };

  // Render component
  return (
    <Box sx={{ flexGrow: 1 }} className={styles.root}>
      <AppBar position='static' className={styles.appBar}>
        <Toolbar className={styles.toolBar}>
          <NavLink to='/' >
            <div onClick={() => manageModeAll(props.setModeAll, props.deletePhoto, props.photo)}>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
              >
                <PostAddIcon className={styles.logo} />
              </IconButton>
            </div>
          </NavLink>
          <Typography className={styles.slogan} component='div' sx={{ flexGrow: 1 }}>
            Postify - Home for Your Announcements!
          </Typography>
          {!props.isLoggedIn ? <a href='/auth/google'><Button className={styles.buttonPrimary} variant='outlined' size='large'> <LockOpenIcon className={styles.inlineIcon}/>Login</Button></a> : null}
          {props.isLoggedIn ?  <NavLink to='/' ><Button className={styles.buttonSecondary} onClick={() =>manageModeOwned(props.setModeOwned, props.deletePhoto, props.photo) } variant='outlined'  size='large'><AccountCircleOutlinedIcon className={styles.inlineIcon}/>Your Posts</Button></NavLink> :null }
          {props.isLoggedIn ? <a href='/auth/logout'><Button className={styles.buttonLogout} variant='outlined'  size='large'> <LockOutlinedIcon className={styles.inlineIcon}/>Log out</Button></a> :null }
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  manageLogin: PropTypes.func,
  setModeOwned: PropTypes.func,
  setModeAll: PropTypes.func,
  photo: PropTypes.string,
  deletePhoto: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: getLogged(state),
  photo: getPhoto(state),
});

const mapDispatchToProps = dispatch => ({
  manageLogin: () => dispatch(manageLogin()),
  deletePhoto: (id) => dispatch(deletePhoto(id)),
  setModeAll: () => dispatch(setModeAll()),
  setModeOwned: () => dispatch(setModeOwned()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as Header,
  Component as HeaderComponent,
};
