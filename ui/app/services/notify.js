
const methods = [
  'onError',
  'onInfo',
  'onNotify'
];

const notifications = [];
const subscriptions = {};

const notify = {
  error(message) {
    const notification = { message, error: true };

    notifications.push(notification);
    call('onError', notification);
  },
  info(message) {
    const notification = { message, error: false };

    notifications.push(notification);
    call('onInfo', notification);
  },
  subscribe: {}
};

export default Object.assign({}, notify);

methods.forEach(method => {
  subscriptions[method] = [];
  notify.subscribe[method] = getCallbackRegisterer(method);
});

function isFunction(fn) {
  return typeof fn === 'function';
}

function getCallbackRegisterer(method, callback) {
  return function(callback) {
    isFunction(callback) && subscriptions[method].push(callback);
  };
}

function call(method, notification) {
  let callbacks = subscriptions[method] || [];

  if (method != 'onNotify') {
    callbacks = callbacks.concat(subscriptions.onNotify);
  }

  callbacks.forEach(callback => callback(notification));
}