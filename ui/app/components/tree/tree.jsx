import './tree.css!';

import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from 'react-mdl';
import ContentBox from '../content-box/content-box.jsx!';

import Node from '../../models/node';

import tree from './tree';

export default class Tree extends Component {

  constructor(props) {
    super(props);

    this.state = {
      root: props.root,
      article: null
    };

    tree.onOpenArticle((article) => {
      this.openArticle(article);
    });
  }

  get root() {
    return this.state.root;
  }

  get article() {
    return this.state.article;
  }

  openArticle(article, e) {
    e && e.stopPropagation();

    this.setState({ ...this.state, article });
  }

  closeArticle(query) {
    const { article } = this.state;
    const setState = () => {
      const state = { ...this.state };

      state.article = null;
      this.setState(state);
    }

    if(typeof query === 'string') {
      const node = new Node(query, article.$$node).promise
        .then((node) => {
          article.$$nodes.push(node);
        })
        .then(setState);
    } else {
      setState();
    }
  }

  makeHTML(node, idx = 0) {
    if(!node) return '';

    const queryElement = (
      <h5 className="query">
        &quot;{ node.query }&quot;
        <span className="count"> { node.count } articles</span>
      </h5>
    );
    const articlesElement = (
      <ul className="articles">
        {
          node.articles.map((article, index) => {
            const openArticle = this.openArticle.bind(this, article);

            let nodesElement = '';

            if((article.$$nodes || []).length) {
              nodesElement = article.$$nodes.reverse().map((node, index) => {
                return this.makeHTML(node, index);
              });
            }

            return (
              <li
                className="article"
                key={ index }
                onClick={ openArticle }
                data-has-nodes={!!article.$$nodes.length}>
                <span className="article-title">{ article.articleTitle }</span>
                { nodesElement }
              </li>
            );
          })
        }
      </ul>
    );

    return (
      <div className="node" key={ idx }>
        { queryElement } { articlesElement }
      </div>
    );
  }

  componentWillReceiveProps(props) {
    this.setState({ ...this.state, root: props.root });
  }

  render() {
    const { root, article } = this.state;
    const closeArticle = this.closeArticle.bind(this);

    return (
      <div className="tree">
        { this.makeHTML(root) }

        <ContentBox
          opened={ !!article }
          article={ article }
          onClose={ closeArticle }
        />
      </div>
    );
  }
};