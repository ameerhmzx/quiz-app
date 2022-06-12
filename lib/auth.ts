import Axios from 'axios';

const TOKEN_KEY = 'authToken';
const isBrowser = typeof localStorage !== 'undefined';

let localAccessToken = '';
if (isBrowser) {
  localAccessToken = localStorage.getItem(TOKEN_KEY) || '';
}

if (localAccessToken) {
  Axios.defaults.headers.common.Authorization = `AccessToken ${localAccessToken}`;
}

export const setToken = (token: string = '') => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete Axios.defaults.headers.common.Authorization;
  }

  localAccessToken = token;
};

export const isAuthenticated = () => isBrowser ? !!localAccessToken : true;