import config from '../app.config';

const api = {
  path(resource, params) {
    const { API } = config;
    const RESOURCE = API.RESOURCES[resource];
    const queryString = makeQueryString(RESOURCE.PARAMS, params);

    return `${API.ROOT}${RESOURCE.PATH}?${queryString}`;
  }
};

function makeQueryString(...params) {
  const merged = Object.assign({}, ...params);
  const queryString = Object
    .keys(merged)
    .map(key => {
      const value = merged[key].toString().replace(/\s/g, '+');

      return `${key}=${value}`;
    })
    .join('&');

  return queryString;
}

export default {
  article: {
    select: function(params) {
      return api.path('ARTICLE', params);
    }
  }
};