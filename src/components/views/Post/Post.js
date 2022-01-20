import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import { loadPost, getLogged, getLogin, getAdmin, fetchPost, parseDate, fetchPublished} from '../../../redux/postsRedux.js';

import styles from './Post.module.scss';

// COMPONENT DISPLAYING SPECIFIC POST
const Component = (props) => {
  // Manage access to Post from global state
  props.fetchPublishedPosts();
  props.fetchPost(props.match.params.id);

  const post = props.loadedPost;

  // Auxiliary function parsing text to UpperCase
  const parseText = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  // Render component if post is downloaded
  if(post) {
    return (
      <div className={styles.root} elevation={10} >
        <Box className={styles.container}>
          <h2 className={styles.title}> {post.title} </h2>
          <div className={styles.details}>
            <div className={styles.data} >
              {Object.keys(post.additional).map(key => (
                post.additional[key] ?
                  <div key={key} className={styles.dataItem}>
                    <div className={styles.dataTitle}> {parseText(key)}</div>
                    <div className={styles.dataContent}> {post.additional[key]} {key === 'price' ? '$' : null}</div>
                  </div>
                  : null
              ))}
              <div className={styles.dataItem}>
                <div className={styles.dataTitle}>Date Published</div>
                <div className={styles.dataContent}> {parseDate(post.publishedDate)}</div>
              </div>
              <div className={styles.dataItem}>
                <div className={styles.dataTitle}>Date Edited</div>
                <div className={styles.dataContent}> {parseDate(post.updatedDate)}</div>
              </div>
            </div>
            {!post.photo ?
              <div className={styles.noPhoto}>
              No Photo
                <PhotoCameraIcon className={styles.noPhotoIcon} />
              </div> :
              <div className={styles.photo} >
                <img alt={post.photo} id={post.photo} src={`/uploaded/${post.photo}`} className={styles.selectedPhoto}></img>
              </div>
            }
          </div>
          <div className={styles.text}> {post.text} </div>
          <div className={styles.buttons} >
            {props.isLoggedIn && props.login === post.additional.email? <NavLink to={`/post/${post._id}/edit`}><Button className={styles.buttonEdit} size='large'> Edit</Button></NavLink> : null }
          </div>
        </Box>
      </div>
    );
  } else {
    // Display nothing until Post is downloaded
    return (
      <span></span>
    );
  }
};

Component.propTypes = {
  match: PropTypes.any,
  loadedPost: PropTypes.any,
  fetchPost: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  admin: PropTypes.bool,
  fetchPublishedPosts: PropTypes.func,
  login: PropTypes.string,
};

const mapStateToProps = state => ({
  isLoggedIn: getLogged(state),
  loadedPost: loadPost(state),
  admin: getAdmin(state),
  login: getLogin(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPost: arg => dispatch(fetchPost(arg)),
  fetchPublishedPosts: () => dispatch(fetchPublished()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as Post,
  Component as PostComponent,
};
