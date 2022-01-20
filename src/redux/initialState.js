/* INITIAL SETTINGS FOR COMPONENT */

export const initialState = {
  posts: {
    data: [],
    loading: {
      active: false,
      error: false,
    },
    isLoggedIn: false,
    admin: false,
    paginationPage: 0,
    upToDate: false,
  },
};
