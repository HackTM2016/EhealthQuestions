import './searchbar.css!';

import React, { Component } from 'react';
import { Textfield, Button, Grid, Cell, Switch } from 'react-mdl';
import search from './search';

export default class Searchbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      view: 'Article View'
    };

    // Autosearch (comment them in the end)
    // this.state.query = 'tamoxifen';
    // this.search();

    search.register((query) => {
      this.setState({ ...this.state, query }, this.search.bind(this));
    });
  }

  get enabled() {
    return this.state.query.length >= 3;
  }

  get query() {
    return this.state.query;
  }

  get onSearchCallback() {
    return typeof this.props.onSearch === 'function'
      ? this.props.onSearch
      : () => {};
  }

  onChange(e) {
    const query = e.target.value;

    this.setState({ ...this.state, query });
  }

  onViewChange(e) {
    const view = (e.target.checked
      ? 'Popcorn' : 'Article') + ' view';

    this.setState({ ...this.state, view });
  }

  onEnterKeyPress(e) {
    if(e.which === 13) {
      e.preventDefault();
      this.search();
    }
  }

  search() {
    this.enabled && this.onSearchCallback.call(null, this.state.query);
  }

  componentWillReceiveProps(props) {
    //console.log(props);
  }

  render() {
    let {
      onChange,
      onViewChange,
      onEnterKeyPress,
      search,
      state,
      enabled
    } = this;

    const { query } = state;

    onChange = onChange.bind(this);
    onViewChange = onViewChange.bind(this);
    onEnterKeyPress = onEnterKeyPress.bind(this);
    search = search.bind(this);

    return (
      <div className="searchbar">
        <Grid>
          <Cell col={ 2 } className="hacktm-logo"/>
          <Cell col={ 1 } className="ness-logo"/>
          <Cell col={ 3 } className="app-logo">
            Health <span>Questions</span>
          </Cell>
          <Cell col={ 4 }>
            <Textfield
              label="Search"
              placeholder="Start searching here"
              value={ query }
              style={{width: '100%'}}
              onChange={ onChange }
              onKeyPress={ onEnterKeyPress }/>
          </Cell>
          <Cell col={ 2 }>
            <Button
              className="search-button"
              raised
              onClick={ search }
              disabled={ !enabled }>
              Search
            </Button>
          </Cell>
        </Grid>
      </div>
    );
  }
};