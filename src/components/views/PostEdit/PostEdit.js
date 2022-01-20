import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '../../features/Select/Select';
import WarningModal from '../../features/WarningModal/WarningModal';
import { connect } from 'react-redux';
import { loadPost, fetchPost, getLogged, getLogin, getUpToDate, getAdmin, editPost, getPhoto, uploadPhoto, deletePhoto, clearPhoto, deleteSavedPhoto,
  enableAlert, disableAlert} from '../../../redux/postsRedux.js';
import styles from './PostEdit.module.scss';

/* FORM COMPONENT TO EDIT EXISTING POST */
const Component = (props) => {
  props.fetchPost(props.match.params.id);
  const loadedPost = props.loadedPost;
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
    if (status) {
      const escapedStatus = escape(status);

      for (let item of forbidden) {
        if(escapedStatus.includes(item)) {
          return false;
        }
      }

      if (escapedStatus === 'draft' || escapedStatus === 'published' || escapedStatus === 'closed') {
        return escapedStatus;
      } else {
        return false;
      }
    }
  };

  // Collecting and validating all Post data to send them to the server
  const handleSubmit = async (event, props, status) => {
    event.preventDefault();
    const newPost = {};
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
        newPost[input.id] = result;
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
      newPost[text.id] = verifiedText;
      text.classList.remove('warning');
    } else {
      text.classList.add('warning');
    }

    if (veifiedCategory !== false) {
      newPost.category = veifiedCategory;
      select.classList.remove('warning');
    } else {
      select.classList.add('warning');
    }

    if (verifiedPhoto !== false) {
      newPost.photo  = verifiedPhoto;
    }

    if (status && verifiedStatus !== false) {
      newPost.status = verifiedStatus;
    } else if (status) {
      newPost.status = 'Warning';
    } else if (!status) {
      newPost.status = loadedPost.additional.status;
    }

    newPost.id = loadedPost._id;
    const warnings = document.querySelectorAll('.warning');

    // If there is no warnings, send edited Post to server and clear Photo state
    if (warnings.length === 0) {
      await props.editPost(newPost);
      await props.clearPhoto();

      history.push(`/post/${props.match.params.id}`);
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

  // Removed photo already saved in this Post
  const handleSavedPhotoRemoval = (event, clearPhoto, deleteSavedPhoto, photoName, id) => {
    deleteSavedPhoto(photoName, id);
    clearPhoto();
  };

  // Render component only if User is logged in
  if(loadedPost) {
    if(props.isLoggedIn && props.login === loadedPost.additional.email) {
      return (
        <div className={styles.root} elevation={10} sx={{background: '#FFF7D6'}}>
          <Box className={styles.container}>
            <label className={styles.titleLabel}> Title </label>
            <input type='text' id='title' defaultValue={loadedPost.title} className={styles.title} />
            <div className={styles.details}>
              <div className={styles.data} >
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> category</label>
                  <Select id='category-select' initialValue={loadedPost.additional.category} />
                </div>
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> email </label>
                  <input type='text' id='email' className={styles.dataContent} value={loadedPost.additional.email} />
                </div>
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> status </label>
                  <input type='text' id='status' className={styles.dataContent} value={loadedPost.additional.status} />
                </div>
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> price </label>
                  <input type='text' id='price' className={styles.dataContent} defaultValue={loadedPost.additional.price} />
                </div>
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> phone </label>
                  <input type='text' id='phone' className={styles.dataContent} defaultValue={loadedPost.additional.phone}/>
                </div>
                <div className={styles.dataItem}>
                  <label className={styles.dataTitle}> area </label>
                  <input type='text' id='area' className={styles.dataContent}  defaultValue={loadedPost.additional.area}/>
                </div>
              </div>
              <div className={!props.photo ? styles.photo : styles.photoUploaded} id={'photo'}>
                <label htmlFor='img'>
                  <p> Change Image: </p>
                  {!props.photo ? <Button component='span' className={styles.photoButton}> Select </Button> : null}
                </label>
                {!props.photo && loadedPost.photo ? <img alt={loadedPost.photo} id={loadedPost.photo} src={`/uploaded/${loadedPost.photo}`} className={styles.selectedPhoto}></img> :null}
                {props.photo ? <img alt={props.photo} id={props.photo} src={`/uploaded/${props.photo}`} className={styles.selectedPhoto}></img> :null}
                {props.photo ? <Button component='span' id={props.photo} className={styles.photoDeleteButton}  onClick={(e) => handlePhotoRemoval(e, props.deletePhoto)}> Return </Button> : null}
                {!props.photo && loadedPost.photo ? <Button component='span' id={loadedPost.photo} className={styles.photoDeleteButton}  onClick={(e) => handleSavedPhotoRemoval(e, props.clearPhoto, props.deleteSavedPhoto, loadedPost.photo, loadedPost._id)}> Remove </Button> : null}
                <input type='file' id='img' name='img' accept='image/*' onChange={(e) => handlePhoto(e, props.uploadPhoto)} />
              </div>
            </div>
            <label className={styles.titleLabel}> Announcement </label>
            <textarea rows='3' cols='3' id='text' className={styles.text} defaultValue={loadedPost.text}/>
            <div className={styles.buttons} >
              {props.isLoggedIn ?<Button className={styles.buttonEdit} onClick={(event) => handleSubmit(event, props, null)} size='large'> Save Changes </Button> : null }
              {props.isLoggedIn && (loadedPost.additional.status === 'draft' || loadedPost.additional.status === 'closed') ?<Button className={styles.buttonEdit}
                onClick={(event) => handleSubmit(event, props, 'published', )} size='large'> Publish </Button> : null }
              {props.isLoggedIn ?<NavLink to={`/post/${loadedPost._id}`}><Button onClick= {props.clearPhoto} className={styles.buttonDiscard} size='large'> Discard Changes </Button></NavLink> : null }
              {props.isLoggedIn && loadedPost.additional.status === 'published' ?<Button className={styles.buttonDelete} onClick={(event) => handleSubmit(event, props, 'closed')} size='large'> Delete Post </Button> : null }
            </div>
          </Box>
          <WarningModal givenFunction={props.disableAlert} />
        </div>
      );
    } else {
      // If User is not logged in, redirect to Not Found component
      return(
        <Redirect from='*' to='/' />
      );
    }
  } else {
    return (
      <span></span>
    );
  }
};

Component.propTypes = {
  match: PropTypes.any,
  getPost: PropTypes.func,
  editPost: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  upToDate: PropTypes.bool,
  admin: PropTypes.bool,
  loadedPost: PropTypes.any,
  login: PropTypes.string,
};

const mapStateToProps = state => ({
  isLoggedIn: getLogged(state),
  upToDate: getUpToDate(state),
  admin: getAdmin(state),
  loadedPost: loadPost(state),
  login: getLogin(state),
  photo: getPhoto(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPost: arg => dispatch(fetchPost(arg)),
  editPost: data => dispatch(editPost(data)),
  uploadPhoto: photo => dispatch(uploadPhoto(photo)),
  clearPhoto: () => dispatch(clearPhoto()),
  deletePhoto: photo => dispatch(deletePhoto(photo)),
  deleteSavedPhoto: (name, id) => dispatch(deleteSavedPhoto(name, id)),
  enableAlert: () => dispatch(enableAlert()),
  disableAlert: () => dispatch(disableAlert()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as PostEdit,
  Component as PostEditComponent,
};
