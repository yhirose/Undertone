/* global gapi:false */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import moment from 'moment';
import App from './App';
import Bible from './bible';
import './index.css';
import { API_KEY, CLIENT_ID } from './config';

const FILE_NAME = 'data.json';

const INITIAL_STATE = {
  version: 1,
  currentIndex: 0,
  checks: {},
  links: [
    {
      label: 'NWT English',
      url: 'http://m.wol.jw.org/en/wol/b/r1/lp-e/nwt/E/2013/{book}/{chapter}'
    },
    {
      label: 'Rbi8 Japanese',
      url: 'http://m.wol.jw.org/ja/wol/b/r7/lp-j/Rbi8/J/1985/{book}/{chapter}'
    }
  ]
};

const loadGoogleAPIClient = (callback) => {
  const signinButton = document.getElementById('signin');
  let auth2;

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      callback();
    } else {
      signinButton.style.display = 'block';
    }
  }

  const initAuth = () => {
    gapi.client.setApiKey(API_KEY);
    auth2 = gapi.auth2.init({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.appdata'
    }).then(() => {
      auth2 = gapi.auth2.getAuthInstance();
      auth2.isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(auth2.isSignedIn.get());
    });
  }

  window.handleClientLoad = () => {
    gapi.load('client:auth2', initAuth);
  }

  const script = document.createElement('script');
  script.src = "https://apis.google.com/js/client.js?onload=handleClientLoad";
  document.getElementsByTagName('head')[0].appendChild(script);

  signinButton.addEventListener("click", (event) => {
    gapi.auth2.getAuthInstance().signIn();
  });
};

const createFile = (fileMetadata, content, callback, errCallback) => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const multipartRequestBody = delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(fileMetadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(content) +
    close_delim;

  const arg = {
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: {
      uploadType: 'multipart'
    },
    headers: {
      'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
    },
    body: multipartRequestBody
  };

  gapi.client.request(arg).then(
    (resp) => {
      if (callback) {
        callback(resp.result.id);
      }
    },
    errCallback);
};

const updateFile = (fileId, fileMetadata, content, callback, errCallback) => {
  const arg = {
    path: '/upload/drive/v3/files/' + fileId,
    method: 'PATCH',
    params: {
      uploadType: 'media'
    },
    body: JSON.stringify(content)
  };

  gapi.client.request(arg).then(
    (resp) => {
      if (callback) {
        callback(resp.result.id);
      }
    },
    errCallback);
};

const loadFile = (fileId, callback, errCallback) => {
  return gapi.client.drive.files.get({
    fileId,
    alt: 'media'
  }).then((resp) => {
    callback(JSON.parse(resp.body));
  }, errCallback);
};

const getDataFileId = (name, callback, errCallback) => {
  gapi.client.load('drive', 'v3').then(() => {
    gapi.client.drive.files.list({
      spaces: 'appDataFolder',
      q: `name='${name}'`,
      fields: 'files(id, name)'
    }).then((resp) => {
      const files = resp.result.files;
      if (files && files.length > 0) {
        callback(files[0].id);
      } else {
        createFile({
            name,
            parents: ['appDataFolder'],
            mimeType: 'application/json'
        }, INITIAL_STATE, callback, errCallback);
      }
    });
  }, errCallback);
};

const runApplication = (fileId, errCallback) => {
  loadFile(fileId, (initialState) => {
    const reducer = (state = initialState, action) => {
      let newState = state;
      switch(action.type) {
        case 'SET_INDEX': {
          const currentIndex = action.index;
          newState = Object.assign({}, state, { currentIndex });
          break;
        }
        case 'PREV': {
          const currentIndex = Bible.getPreviousIndex(state.currentIndex);
          newState = Object.assign({}, state, { currentIndex });
          break;
        }
        case 'NEXT': {
          const currentIndex = Bible.getNextIndex(state.currentIndex);
          newState = Object.assign({}, state, { currentIndex });
          break;
        }
        case 'TOGGLE_CHECK': {
          let checks = Object.assign({}, state.checks);
          const checked = checks[action.index];
          if (checked) {
              delete checks[action.index];
          } else {
              checks[action.index] = moment();
          }
          newState = Object.assign({}, state, { checks });
          break;
        }
        default:
          break;
      }

      updateFile(fileId, {}, newState, null, errCallback);

      console.log(JSON.stringify(newState, null, 2));
      return newState;
    };

    const store = createStore(reducer);

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  }, errCallback);
};

loadGoogleAPIClient(() => {
  const errorLog = (reason) => {
    console.log('Error: ' + reason.result.error.message);
  };
  getDataFileId(FILE_NAME, (fileId) => {
    runApplication(fileId, errorLog);
  }, errorLog);
});
