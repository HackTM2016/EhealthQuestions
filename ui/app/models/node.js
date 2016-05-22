import notify from '../services/notify';
import articles from '../services/articles';
import api from '../services/api';

export default class Node {
  constructor(query, parent = null) {
    this.parent = parent;
    this.query = query;
    this.articles = [];
    this.resolved = false;
    this.failed = false;
    this.count = 0;

    const uri = api.article.select({
      q: encodeURIComponent(this.queries)
    });
    
    this.promise = articles
      .get(uri)
      .then(response => {
        this.count = response.numFound;

        return response.docs;
      })
      .then(articles => {
        this.articles = articles.map(article => {
          article.$$nodes = [];
          article.$$node = this;

          return article;
        });

        this.resolved = true;

        return this;
      })
      .catch(error => {
        console.error('Error getting articles', error);
        this.resolved = true;
        this.failed = true;
        notify.error(`Something went wrong!`);
      });
  }

  get queries() {
    const { parent } = this;
    let { query } = this;

    query = `body:${query.replace(/\s/g, '+')}`;

    return (parent instanceof Node)
      ? `${parent.queries}\nAND\n${query}`
      : query;
  }

  map(nodeMap = () => {}, articleMap = () => {}) {
    let node = { ...this };

    delete node.failed;
    delete node.parent;
    delete node.resolved;
    delete node.promise;

    nodeMap.call(node);

    if(node.articles.length) {
      node.articles = node.articles.map(article => {
        delete article.$$node;

        articleMap.call(article);

        article.$$nodes = article.$$nodes.map(node => {
          return node.map(nodeMap, articleMap);
        });

        return article;
      });
    };

    return node;
  }

  toString() {
    return JSON.stringify(this.json);
  }
};