const callbacks = [];

function search(query) {
  callbacks.forEach(callback => callback.call(null, query));
}

export default {
  query(query) {
    search(query);
  },

  register(callback) {
    if(typeof callback === 'function') {
      callbacks.push(callback);
    }
  }
}