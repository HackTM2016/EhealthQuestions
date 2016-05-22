import './app.css!';

import React, { Component } from 'react';
import { Snackbar } from 'react-mdl';

import notify from './services/notify';

import Node from './models/node';

import Searchbar from './components/searchbar/searchbar.jsx!';
import Tree from './components/tree/tree.jsx!';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notification: null,
      node: null
    };

    notify.subscribe.onNotify(notification => {
      this.setState({ ...this.state, notification });
    });
  } 

  get node() {
    return this.state.node;
  }

  get notification() {
    const { state } = this;
    const { notification } = state;

    return {
      active: !!notification,
      message: (notification || {}).message || 'Ooops! Something went wrong',
      error: (notification || {}).error || true
    };
  }

  search(query) {
    return new Node(query).promise.then((node) => {
      this.setState({ ...this.state, node });
    });
  }

  onNotificationTimeout() {
    this.setState({ ...this.state, notification: null });
  }

  render() {
    const { notification, node } = this;
    const search = this.search.bind(this);
    const onNotificationTimeout = this.onNotificationTimeout.bind(this);

    return (
      <div className="app" data-has-node={ !!node }>
        <Searchbar onSearch={ search } />
        
        {(() => {
          if(node) return (<Tree root={ node } />);
        })()}
        
        <Snackbar
          active={ notification.active }
          onTimeout={ onNotificationTimeout }>
            { notification.message }
        </Snackbar>
      </div>
    );
  }
};