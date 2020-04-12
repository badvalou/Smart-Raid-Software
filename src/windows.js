/**
 * Project : Smart-raid
 * IUT de Roanne - RT 2020
 * Team : Léo - Valentin - Bastien - Alex - Khadidia
 * Projet basé sur : https://github.com/deskfiler/deskfiler
 */
const { BrowserWindow , ipcMain } = require('electron')
const mysql = require('mysql')

var sql = require('./db'); // DEV ENV ONLY
const store = require('./store')

let mainWindow;
let projectWindow;

const position = store.get('windowPosition');
if (!position) {
  store.set('windowPosition', [0, 0]);
}

async function createProjectWindow() {
  projectWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    x: store.get('windowPosition')[0],
    y: store.get('windowPosition')[1],
    webPreferences: {
      nodeIntegration: true
    }
  });
  projectWindow.loadURL('file://' + __dirname + '/views/project.pug');
  projectWindow.on('closed', function() {
        projectWindow = null;
  });
}

const mainWindowWith = store.get('mainWindowWith');
if(!mainWindowWith) {
    store.set('mainWindowWith', 800);
}

const mainWindowHeight = store.get('mainWindowHeight');
if(!mainWindowHeight) {
    store.set('mainWindowHeight', 800);
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: mainWindowWith, height: mainWindowHeight,
    minWidth: 900,
    x: store.get('windowPosition')[0],
    y: store.get('windowPosition')[1],
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL('file://' + __dirname + '/views/index.pug');

  ipcMain.on('has-team', function (event, data) {
    var idTeam = store.get('teamID');
    if(!idTeam) {
      idTeam = -1;
    }
    mainWindow.webContents.send('responce-has-team', idTeam);
  });

  ipcMain.on('request-team', function(event, data) {
      var error = 'no error';
      var id = data.id;
      if(isNaN(id)) {
        error = 'id is not number';
        var responce = {error : error};
        mainWindow.webContents.send('responce-team', responce);
      } else {
        sql.query("SELECT * FROM Message JOIN course c on Message.course_id = c.course_id WHERE c.course_id = '" + id + "'", function (error, result) {
            sql.query("SELECT Photo.* FROM Photo JOIN course c on Photo.course_id = c.course_id WHERE c.course_id = '" + id + "'", function (error, photoResult) {
                var responce = {error : error, messages : result, photos : photoResult};
                mainWindow.webContents.send('responce-team', responce);
            });
        });
        store.set('teamID', id);
      }

  });

  ipcMain.on('request-project', function(event, data) {
      if(!projectWindow) {
        createProjectWindow();
      }
      projectWindow.show();
      projectWindow.focus();
  });

  mainWindow.on('will-resize', function (event, bound) {
    store.set('mainWindowWith', bound.width);
    store.set('mainWindowHeight', bound.height);
  });
}

const getMainWindow = () => mainWindow;

module.exports = {
  getMainWindow,
  createProjectWindow,
  createMainWindow,
};
