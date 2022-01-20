import Axios from 'axios';
import { URL } from '../config';

/* SELECTORS */
export const getMode = ({posts}) => posts.onlyOwned;
export const getAlert = ({posts}) => posts.alert;
export const getAll = ({posts}) => posts.data;
export const getAllPublished = ({posts}) => posts.data.filter(item => item.additional.status === 'published');
export const getAllOwned = ({posts}) => posts.data.filter(item => item.additional.email === posts.login);
export const getPage = ({posts}) => posts.paginationPage;
export const getLogged = ({posts}) => posts.isLoggedIn;
export const getUpToDate = ({posts}) => posts.upToDate;
export const getAdmin = ({posts}) => posts.admin;
export const getLogin = ({posts}) => posts.login;
export const getPhoto = ({posts}) => posts.photo;
export const loadPost = ({posts}) => posts.currentPost;
export const getPost = ({posts}, id) => {
  const postInArray = posts.data.filter(post => post._id === id);
  return postInArray[0];
};

/* AUXILLIARY FUNCTION PARSING DATE FOR POSTS */
export const parseDate = (time) => {
  const split = time.split('T');
  const hour = split[1].substr(0, 5);
  return  hour + ' ' + split[0];
};

/* ACTION NAME CREATOR */
const reducerName = 'posts';
const createActionName = name => `app/${reducerName}/${name}`;

/* ACTION TYPES */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const FETCH_PAGE = createActionName('FETCH_PAGE');
const SET_PAGE = createActionName('SET_PAGE');
const SEND_POST = createActionName('SEND_POST');
const EDIT_POST = createActionName('EDIT_POST');
const FETCH_LOGIN = createActionName('FETCH_LOGIN');
const MODE_ALL = createActionName('MODE_ALL');
const MODE_OWNED = createActionName('MODE_OWNED');
const STORE_PHOTO = createActionName('STORE_PHOTO');
const CLEAR_PHOTO = createActionName('CLEAR_PHOTO');
const DELETE_PHOTO = createActionName('DELETE_PHOTO');
const DISABLE_ALERT = createActionName('DISABLE_ALERT');
const ENABLE_ALERT = createActionName('ENABLE_ALERT');

/* ACTION CREATORS */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const fetchPage = payload => ({ payload, type: FETCH_PAGE });
export const newPost = payload => ({ payload, type: SEND_POST });
export const setPage = payload => ({ payload, type: SET_PAGE });
export const fetchLogin = payload => ({ payload, type: FETCH_LOGIN });
export const changePost = payload => ({ payload, type: EDIT_POST });
export const setModeAll = payload => ({ payload, type: MODE_ALL });
export const setModeOwned = payload => ({ payload, type: MODE_OWNED });
export const storePhoto = payload => ({payload, type: STORE_PHOTO});
export const clearPhoto = payload => ({payload, type: CLEAR_PHOTO});
export const clearSavedPhoto = payload => ({payload, type: DELETE_PHOTO});
export const disableAlert = payload => ({payload, type: DISABLE_ALERT});
export const enableAlert = payload => ({payload, type: ENABLE_ALERT});

/* THUNK CREATORS */
// Fetch all published Posts if global state is not already up to date
export const fetchPublished = () => {
  return (dispatch, getState) => {
    const state = getState();

    if(state.posts.upToDate === false && state.posts.loading.active === false ) {
      dispatch(fetchStarted());

      Axios
        .get(`${URL}api/posts`)
        .then(res => {
          dispatch(fetchSuccess(res.data));
        })
        .catch(err => {
          dispatch(fetchError(err.message || true));
        });
    }
  };
};

// Fetch all owned Posts if global state is not already up to date
export const fetchOwned = (login) => {
  return (dispatch, getState) => {
    const state = getState();

    if(state.posts.upToDate === false && state.posts.loading.active === false ) {
      dispatch(fetchStarted());

      Axios
        .get(`${URL}api/posts/owned/${login}`)
        .then(res => {
          dispatch(fetchSuccess(res.data));
        })
        .catch(err => {
          dispatch(fetchError(err.message || true));
        });
    }
  };
};

// Download login data
export const manageLogin = () => {
  return (dispatch, getState) => {
    Axios
      .get(`${URL}auth/login`)
      .then(res => {
        dispatch(fetchLogin(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

// Fetch specific Post
export const fetchPost = (id) => {
  return (dispatch, getState) => {
    const state = getState();

    if(!state.posts.currentPost || state.posts.currentPost._id !== id) {
      dispatch(fetchStarted());

      Axios
        .get(`${URL}api/posts/${id}`)
        .then(res => {
          dispatch(fetchPage(res.data));
        })
        .catch(err => {
          dispatch(fetchError(err.message || true));
        });
    }
  };
};

// Post new Post
export const sendPost = (post) => {
  return (dispatch) => {

    Axios
      .post(`${URL}api/posts`, post)
      .then(res => {
        dispatch(newPost(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

// Edit existing Post
export const editPost = (newPost) => {
  return (dispatch) => {

    Axios
      .put(`${URL}api/posts/${newPost.id}`, newPost)
      .then(res => {
        dispatch(changePost(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

// Initially upload given photo
export const uploadPhoto = (photo) => {
  return (dispatch) => {

    const formData = new FormData();
    formData.append('photo', photo);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    Axios
      .post(`${URL}api/posts/photo`, formData, config)
      .then(res => {
        dispatch(storePhoto(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

// Delete previously given photo
export const deletePhoto = (photo) => {
  const data = {deletePhoto: photo};

  return (dispatch) => {
    Axios
      .post(`${URL}api/posts/deletePhoto`, data)
      .then(res => {
        dispatch(clearPhoto());
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

// Delete photo already saved in data of specific Post
export const deleteSavedPhoto = (photoName, id) => {
  const data = {name: photoName};

  return (dispatch) => {
    Axios
      .put(`${URL}api/posts/${id}/deletePhoto`, data)
      .then(res => {
        dispatch(clearSavedPhoto());
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

/* REDUCER */
export const reducer = (statePart = [], action = {}, state) => {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
        upToDate: true,
      };
    }
    case MODE_OWNED: {
      return {
        ...statePart,
        onlyOwned: true,
      };
    }
    case MODE_ALL: {
      return {
        ...statePart,
        onlyOwned: false,
      };
    }
    case STORE_PHOTO: {
      return {
        ...statePart,
        photo: action.payload,
      };
    }
    case CLEAR_PHOTO: {
      return {
        ...statePart,
        photo: null,
      };
    }
    case DELETE_PHOTO: {
      return {
        ...statePart,
        currentPost: action.payload,
        photo: null,
      };
    }
    case FETCH_PAGE: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        currentPost: action.payload,
      };
    }
    case FETCH_LOGIN: {
      return {
        ...statePart,
        isLoggedIn: action.payload.isLoggedIn,
        login: action.payload.email,
      };
    }
    case SEND_POST: {
      return {
        ...statePart,
        data: [
          ...statePart.data,
          action.payload,
        ],
        currentPost: action.payload,
        upToDate: false,
      };
    }
    case EDIT_POST: {
      return {
        ...statePart,
        currentPost: null,
        upToDate: false,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case SET_PAGE: {
      return {
        ...statePart,
        paginationPage: action.payload,
      };
    }
    case DISABLE_ALERT: {
      return {
        ...statePart,
        alert: false,
      };
    }
    case ENABLE_ALERT: {
      return {
        ...statePart,
        alert: true,
      };
    }
    default:
      return statePart;
  }
};
