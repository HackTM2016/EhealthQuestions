import './content-box.css!';

import React, { Component } from 'react';
import { Button } from 'react-mdl';
import search from '../searchbar/search';

export default class ContentBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      article: null,
      selection: ''
    };
  }

  get searchable() {
    return !!this.state.selection;
  }

  get onSelectTextCallback() {
    const callback = this.props.onSelectText;

    return typeof callback === 'function' ? callback : () => {};
  }

  get onCloseCallback() {
    const callback = this.props.onClose;

    return typeof callback === 'function' ? callback : () => {};
  }

  closeContent(selection) {
    const state = { ...this.state, opened: false, selection: '' };
    const onCloseCallback = this.onCloseCallback.bind(this, selection);

    this.setState(state, onCloseCallback);
  }

  componentDidMount() {
    const element = this.refs.selectableContainer;

    element.addEventListener('mouseup', () => {
      const text = window.getSelection().toString().trim();
      const content = element.textContent;

      let selection = '';

      if(text && content) {
        const pattern = new RegExp(`[^\\s]*${text}[^\\s]*`, 'i');
        const matches = pattern.exec(content);
        
        selection = (matches ? matches[0] : '')
          .toLowerCase()
          .replace(/[\.\,\:\-\(\)]/g, ' ')
          .trim();
      }

      this.setState({ ...this.state, selection });
    });
  }

  componentWillReceiveProps(props) {
    const { state } = this;
    const { opened, article } = props;

    this.setState({ ...state, opened, article });
  }

  render() {
    const { opened, selection, article } = this.state;
    const closeContent = this.closeContent.bind(this);
    const closeContentWithSelection = this.closeContent.bind(this, selection);

    const selectionButtonLabel = this.searchable
      ? (<span>Search for &quot;{ selection }&quot;</span>)
      : (<span>Select text to search</span>);

    return (
      <article className="content-box" data-opened={!!opened}>
        <div className="content-box__header">
          <Button onClick={ closeContent }>
            { `Close` }
          </Button>

          <Button onClick={ closeContentWithSelection } disabled={ !this.searchable }>
            { selectionButtonLabel }
          </Button>
        </div>
        
        <div className="content-box__content" ref="selectableContainer">
          {(() => {
            if(article) {
              return (
                <div className="content-box__content-wrapper">
                  <h4 className="content-box__content-title">
                    { article.articleTitle }
                  </h4>

                  <ul class="content-box__content-meta">
                    {((value) => {
                      if(value) return (<li> Publisher: { value } </li>);
                    })(article.publisherName)}


                    {((value) => {
                      if(value) return (<li> Published: { value } </li>);
                    })(article.epub)}

                    {((value) => {
                      if(value) return (<li> Journal: { value } </li>);
                    })(article.journalTitle)}
                  </ul>

                  <div className="content-box__content-body">
                    { article.body }
                  </div>
                </div>    
              );
            }
          })()}
        </div>
      </article>
    );
  }
};