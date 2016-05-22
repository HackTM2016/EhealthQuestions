const callbacks = {
  onOpenArticle: []
};

export default {
  onOpenArticle(callback) {
    typeof callback === 'function' && callbacks.onOpenArticle.push(callback);
  },
  openArticle(article) {
    callbacks.onOpenArticle.forEach(callback => callback.call(null, article));
  }
};