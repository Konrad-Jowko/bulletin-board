import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, NavLink  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import Select from '../../features/Select/Select';
import WarningModal from '../../features/WarningModal/WarningModal';
import {getLogged, sendPost, getLogin, getPhoto, uploadPhoto, clearPhoto, deletePhoto, enableAlert, disableAlert} from '../../../redux/postsRedux.js';

import styles from './PostAdd.module.scss';

/* FORM COMPONENT TO ADD NEW POST */
const Component = (props) => {
  const history = useHistory();

  /* AUXILIARY CONSTS AND FUNCTIONS TO VALIDATE INPUT*/
  // ASCII forbidden in inputs
  const forbidden = [ '&amp;', '&lt;', '&gt;', '&quot;', '&#039;'];

  // Escaping characters to ASCII
  const escape = (html) => {
    if(typeof html === 'string') {
      return html.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  // Text input validation
  const verifyText = (text) => {
    const escapedText = escape(text);

    for (let item of forbidden) {
      if(escapedText.includes(item)) {
        return false;
      }
    }

    if (escapedText.length > 1) {
      return escapedText;
    } else {
      return false;
    }
  };

  // Email input validation
  const verifyEmail = (email) => {
    const regex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    const escapedEmail = escape(email);

    for (let item of forbidden) {
      if(escapedEmail.includes(item)) {
        return false;
      }
    }

    if(regex.test(escapedEmail) && escapedEmail.length > 1) {
      return escapedEmail;
    } else {
      return false;
    }
  };

  // Price input validation
  const verifyPrice = (price) => {
    if(price.length > 0) {
      const escapedPrice = escape(price);

      if (!isNaN(escapedPrice) && escapedPrice.length > 1) {
        return parseInt(escapedPrice);
      } else {
        return false;
      }
    } else {
      return 'ignore';
    }
  };

  // Phone number input validation
  const verifyPhone = (phone) => {

    if (phone.length > 0) {
      const escapedPhone = escape(phone);

      for (let item of forbidden) {
        if(escapedPhone.includes(item)) {
          return false;
        }
      }

      if (!isNaN(escapedPhone) && escapedPhone.length > 1 && escapedPhone.length < 12) {
        return escapedPhone;
      } else {
        return false;
      }
    } else {
      return 'ignore';
    }
  };

  // Category Selector validation
  const verifySelect = (select) => {
    const escapedSelect = escape(select);
    const options = [
      'Announcements',
      'Real Estate',
      'House and Garden',
      'Entertainment',
      'Automotive',
      'Work',
      'Electronics',
      'Services',
      'Sport',
      'Buy/Sell',
      'Other',
    ];

    for (let item of forbidden) {
      if(escapedSelect.includes(item)) {
        return false;
      }
    }

    for (let option of options) {
      if(escapedSelect.includes(option)) {
        return escapedSelect;
      }
    }
    return false;
  };

  // Photo name validation
  const verifyPhoto = (photoName) => {
    if (photoName) {
      const escapedPhotoName = escape(photoName);
      const allowedExtensions = ['jpg','jpeg','jfif','png'];
      const extension = escapedPhotoName.split('.')[1];

      for (let item of forbidden) {
        if(escapedPhotoName.includes(item)) {
          return false;
        }
      }

      for (let item of allowedExtensions) {
        if(extension === item) {
          return escapedPhotoName;
        }
      }
      return false;
    } else {
      return false;
    }
  };

  // Status validation
  const verifyStatus = (status) => {
    const escapedStatus = escape(status);

    for (let item of forbidden) {
      if(escapedStatus.includes(item)) {
        return false;
      }
    }

    if (escapedStatus === 'draft' || escapedStatus === 'published') {
      return escapedStatus;
    } else {
      return false;
    }
  };

  // Collecting and validating all Post data to send them to the server
  const handleSubmit = async (event, props, status) => {
    event.preventDefault();
    const post = {};
    const inputs = document.querySelectorAll('input');
    const text = document.querySelector('textarea');
    const select = document.getElementById('category-select-pickedValue');

    for (let input of inputs) {
      let result;

      // Veryfying inputs and setting up warnings if something is wrong
      if (input.id === 'email') {
        result = verifyEmail(input.value);
      } else if (input.id === 'price') {
        result = verifyPrice(input.value);
      } else if (input.id === 'phone') {
        result = verifyPhone(input.value);
      } else if (input.id !== 'img') {
        result = verifyText(input.value);
      } else {
        result = 'ignore';
      }

      if (result && result !== false && result !== 'ignore') {
        post[input.id] = result;
        input.classList.remove('warning');
      } else if (result !== 'ignore')  {
        input.classList.add('warning');
      }
    }

    const verifiedText = verifyText(text.value);
    const veifiedCategory = verifySelect(select.innerHTML);
    const verifiedPhoto = verifyPhoto(props.photo);
    const verifiedStatus = verifyStatus(status);

    if (verifiedText !== false) {
      post[text.id] = verifiedText;
      text.classList.remove('warning');
    } else {
      text.classList.add('warning');
    }

    if (veifiedCategory !== false) {
      post.category = veifiedCategory;
      select.classList.remove('warning');
    } else {
      select.classList.add('warning');
    }

    if (verifiedPhoto !== false) {
      post.photo  = verifiedPhoto;
    }

    if (verifiedStatus !== false) {
      post.status = verifiedStatus;
    } else {
      post.status = 'Warning';
    }

    const warnings = document.querySelectorAll('.warning');

    // If there is no warnings, send Post to server and clear Photo state
    if (warnings.length === 0) {
      await props.sendPost(post);
      await props.clearPhoto();

      history.push('/');
    } else {
      props.enableAlert();
    }

  };

  // Initially verify and download given photo
  const handlePhoto = (event, uploadPhoto) => {
    const photo = event.target.files[0];
    const verifiedName = verifyPhoto(photo.name);

    if (verifiedName !== false) {
      uploadPhoto(photo);
    }
  };

  // Remove given photo
  const handlePhotoRemoval = (event, deletePhoto) => {
    deletePhoto(event.target.id);
  };

  // Render component only if User is logged in
  if(props.isLoggedIn) {
    return (
      <div className={styles.root} elevation={10} sx={{background: '#FFF7D6'}}>
        <Box component='form' className={styles.container}>
          <label className={styles.titleLabel}> Title </label>
          <input type='text' id='title' className={styles.title} placeholder='Type here...' />
          <div className={styles.details}>
            <div className={styles.data} >
              <div className={styles.dataItem}>
                <label className={styles.dataTitle}> Category</label>
                <Select id='category-select' />
              </div>
              <div className={styles.dataItem}>
                <label className={styles.dataTitle}> Email </label>
                <input type='text' id='email' className={styles.dataContent} value={props.login}  />
              </div>
              <div className={styles.dataItem}>
                <label className={styles.dataTitle}> Price </label>
                <input type='text' id='price' className={styles.dataContent} placeholder='Type here...' />
              </div>
              <div className={styles.dataItem}>
                <label className={styles.dataTitle}> Phone </label>
                <input type='text' id='phone' className={styles.dataContent} placeholder='Type here...' />
              </div>
              <div className={styles.dataItem}>
                <label className={styles.dataTitle}> Area </label>
                <input type='text' id='area' className={styles.dataContent} placeholder='Type here...' />
              </div>
            </div>
            <div className={!props.photo ? styles.photo : styles.photoUploaded} id={'photo'}>
              <label htmlFor='img'>
                <p> {!props.photo ? 'Select image:' : 'Change image:'} </p>
                {!props.photo ? <Button component='span' className={styles.photoButton}> Select </Button> : null}
              </label>
              {props.photo ? <img alt={props.photo} id={props.photo} src={`/uploaded/${props.photo}`} className={styles.selectedPhoto}></img> :null}
              {props.photo ? <Button component='span' id={props.photo} className={styles.photoDeleteButton}  onClick={(e) => handlePhotoRemoval(e, props.deletePhoto)}> Delete </Button> : null}
              <input type='file' id='img' name='img' accept='image/*' onChange={(e) => handlePhoto(e, props.uploadPhoto)} />
            </div>
          </div>
          <label className={styles.titleLabel}> Announcement </label>
          <textarea rows='3' cols='3' id='text' className={styles.text} placeholder='Type here...' />
          <div className={styles.buttons} >
            {props.isLoggedIn ?<Button className={styles.buttonDraft} size='large' type='submit' onClick={(event) => handleSubmit(event, props, 'draft')}> Save as Draft </Button>  : null }
            {props.isLoggedIn ?<Button className={styles.buttonEdit} size='large' type='submit' onClick={(event) => handleSubmit(event, props, 'published')}> Publish</Button>  : null }
            {props.isLoggedIn ?<NavLink to='/'><Button className={styles.buttonDelete} size='large' onClick={props.clearPhoto}> Close </Button></NavLink> : null }
          </div>
        </Box>
        <WarningModal givenFunction={props.disableAlert} />
      </div>
    );
  } else {
    // If User is not logged in, redirect to Not Found component
    return(
      <Redirect from='*' to='/404' />
    );
  }
};

Component.propTypes = {
  match: PropTypes.any,
  getPost: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  sendPost: PropTypes.func,
  uploadPhoto: PropTypes.func,
  deletePhoto: PropTypes.func,
  login: PropTypes.string,
};

const mapStateToProps = state => ({
  isLoggedIn: getLogged(state),
  login: getLogin(state),
  photo: getPhoto(state),
});

const mapDispatchToProps = dispatch => ({
  sendPost: data => dispatch(sendPost(data)),
  uploadPhoto: photo => dispatch(uploadPhoto(photo)),
  deletePhoto: photo => dispatch(deletePhoto(photo)),
  clearPhoto: () => dispatch(clearPhoto()),
  enableAlert: () => dispatch(enableAlert()),
  disableAlert: () => dispatch(disableAlert()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as PostAdd,
  Component as PostAddComponent,
};
