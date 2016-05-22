export default {
  get(uri) {
    return fetch(uri)
      .then(response => {
        if (!response.ok) {
          console.error(`${response.url} ${response.status}`);
          return Promise.reject(response);
        }

        return Promise.resolve(response.json());
      })
      .then(article => article.response);
  }
};