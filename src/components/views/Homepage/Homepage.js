import React from 'react';
import PropTypes from 'prop-types';
import { getMode, getPage, setPage, getAllPublished, getAllOwned, getLogged, fetchPublished, fetchOwned, parseDate, getLogin, setModeAll } from '../../../redux/postsRedux.js';
import { NavLink } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';

import styles from './Homepage.module.scss';

/* HOMEPAGE COMPONENT */
const Component = ({login, mode, published, owned, page, setPage, isLoggedIn, fetchPublishedPosts, fetchOwnedPosts, setModeAll}) => {
  let posts;

  // Fetch all or owned Posts depending on current global state
  if (!mode) {
    fetchPublishedPosts();
    posts = published;
  } else {
    fetchOwnedPosts(login);
    posts = owned;
  }

  // Setting Accordion to work correctly
  const [expanded, setExpanded] = React.useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Dividing posts between pages and setting up pagnation
  let pagination = {};

  const handlePagination = (page) => {
    const newPage = page - 1;
    setPage(newPage);
  };

  if (posts.length > 12) {
    let page = [];
    let length = posts.length;
    let i = 0;

    for (let post of posts) {
      if (page.length < 12 && length >= 0) {
        page.push(post);
        length -= 1;
      } else {
        pagination[i] = page;
        i++;
        page = [];
        page.push(post);
      }
      pagination[i] = page;
    }
  } else {
    pagination[0] = posts;
  }

  // Shorten text with elipsis if it is too long
  const shortenText = text => {
    if(text.length > 150) {
      const short = text.substr(0, 150);
      return short + '...';
    } else {
      return text;
    }
  };

  // Render component
  return (
    <div className={styles.root}>

      {!mode ? <h2 className={styles.header}> Let&apos;s see what&apos;s new!</h2> : <h2 className={styles.header}> Your Posts: </h2> }

      {pagination[page].map(post => (
        <Accordion key={post._id}
          className={styles.accordion}
          expanded={expanded === `${post._id}`}
          onChange={handleAccordionChange(`${post._id}`)}
          TransitionProps={{ unmountOnExit: true }}>

          <AccordionSummary
            className={styles.summary}
            expandIcon={<InfoOutlinedIcon className={styles.icon} />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Typography className={styles.title}>
              {post.title}
            </Typography>
            <Typography className={styles.subtitle}>
              <span> Published: {parseDate(post.publishedDate)}</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className={styles.details}>
              <div className={styles.text }> {shortenText(post.text)} </div>
              <div className={styles.additional}>
                {post.additional.category ? <div className={styles.additionalInfoContainer}> Category: <div className={styles.additionalInfo}>
                  {post.additional.category}</div> </div> : null }
                {post.additional.area ? <div className={styles.additionalInfoContainer}> Posted from: <div className={styles.additionalInfo}>
                  {post.additional.area}</div>  </div> : null }
                {post.additional.price ? <div className={styles.additionalInfoContainer}> Price: <div className={styles.additionalInfo}>
                  {post.additional.price}$</div> </div> : null }
              </div>
              <NavLink className={styles.link} to={`/post/${post._id}`}>
                <Button className={styles.button}
                  variant='outlined'
                  color='secondary'
                  size='large'>
                  More
                </Button>
              </NavLink>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      {isLoggedIn ?
        <div className={styles.buttonContainer}>
          <NavLink className={styles.link} to={`/post/add`}>
            <Button className={styles.button}
              variant='outlined'
              color='secondary'
              size='large'>
              New Post
            </Button>
          </NavLink>
          {mode ?
            <Button className={styles.button}
              variant='outlined'
              color='secondary'
              size='large'
              onClick={setModeAll}>
              Homepage
            </Button>
            :null}
        </div>
        : null }

      <Pagination className={styles.pagination}
        count={Object.keys(pagination).length}
        onChange= {(event, page) => handlePagination(page)}  />
    </div>
  );
};


Component.propTypes = {
  mode: PropTypes.bool,
  className: PropTypes.string,
  published: PropTypes.array,
  owned: PropTypes.array,
  page: PropTypes.number,
  setPage: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  fetchPublishedPosts: PropTypes.func,
  fetchOwnedPosts: PropTypes.func,
  setModeAll: PropTypes.func,
  login: PropTypes.string,
};

const mapStateToProps = state => ({
  mode: getMode(state),
  published: getAllPublished(state),
  owned: getAllOwned(state),
  page: getPage(state),
  isLoggedIn: getLogged(state),
  login: getLogin(state),
});

const mapDispatchToProps = (dispatch, state) => ({
  setPage: arg => dispatch(setPage(arg)),
  fetchPublishedPosts: () => dispatch(fetchPublished()),
  fetchOwnedPosts: (login) => dispatch(fetchOwned(login)),
  setModeAll: () => dispatch(setModeAll()),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  Container as Homepage,
  Component as HomepageComponent,
};
