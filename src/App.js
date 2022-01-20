import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { store } from './redux/store';

import { MainLayout } from './components/layout/MainLayout/MainLayout';
import { Homepage } from './components/views/Homepage/Homepage';
import { Post } from './components/views/Post/Post';
import { PostEdit } from './components/views/PostEdit/PostEdit';
import { PostAdd } from './components/views/PostAdd/PostAdd';
import { NotFound } from './components/views/NotFound/NotFound';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <StylesProvider injectFirst>
        <CssBaseline />
        <MainLayout>
          <Switch>
            <Route exact path='/' component={Homepage} />
            <Route exact path='/post/add' component={PostAdd} />
            <Route exact path='/post/:id' component={Post} />
            <Route exact path='/post/:id/edit' component={PostEdit} />
            <Route path='*' component={NotFound} />
          </Switch>
        </MainLayout>
      </StylesProvider>
    </BrowserRouter>
  </Provider>
);

export { App };
