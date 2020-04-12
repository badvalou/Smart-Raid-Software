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
// creation de la page projet
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
  projectWindow.loadURL('file://' + __dirname + '/views/project.pug'); // chargement du template
  projectWindow.on('closed', function() { // evenement a la fermeture de la page projet
        projectWindow = null;
  });
}

// taille de la page a la derniere fermeture de l'application 
const mainWindowWith = store.get('mainWindowWith');
if(!mainWindowWith) {
    store.set('mainWindowWith', 800);
}

const mainWindowHeight = store.get('mainWindowHeight');
if(!mainWindowHeight) {
    store.set('mainWindowHeight', 800);
}
// function createtion de la page principale
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
  // une équipe est deja dans le store
  ipcMain.on('has-team', function (event, data) {
    var idTeam = store.get('teamID');
    if(!idTeam) {
      idTeam = -1;
    }
    mainWindow.webContents.send('responce-has-team', idTeam);
  });
  // demande depuis la template 
  ipcMain.on('request-team', function(event, data) {
      var error = 'no error';
      var id = data.id;
      if(isNaN(id)) { // verifie que id est un nombre sinon message d'erreur
        error = 'id is not number';
        var responce = {error : error}; 
        mainWindow.webContents.send('responce-team', responce); // envoie de la reponse vers le rendu
      } else {
        // DEV ENV ONLY
        sql.query("SELECT * FROM Message JOIN course c on Message.course_id = c.course_id WHERE c.course_id = '" + id + "'", function (error, result) {
            sql.query("SELECT Photo.* FROM Photo JOIN course c on Photo.course_id = c.course_id WHERE c.course_id = '" + id + "'", function (error, photoResult) {
                var responce = {error : error, messages : result, photos : photoResult};
                mainWindow.webContents.send('responce-team', responce); // envoie de la reponse vers le rendu
            });
        });
        // Stockage de l'id de l'équipe dans le fichier userData (store)
        store.set('teamID', id);
      }

  });
  // evenement bouton ouveture de la page projet 
  ipcMain.on('request-project', function(event, data) {
      if(!projectWindow) { // creation de la page si elle n'existe pas 
        createProjectWindow();
      }
      // affichage de la page
      projectWindow.show();
      projectWindow.focus();
  });
  // evenement 'will-resize' : redim de la page 
  mainWindow.on('will-resize', function (event, bound) {
    // sauvegarde des nouvelles data dans le store
    store.set('mainWindowWith', bound.width); 
    store.set('mainWindowHeight', bound.height);
  });
}

// GETTER
const getMainWindow = () => mainWindow;

module.exports = {
  getMainWindow,
  createProjectWindow,
  createMainWindow,
};
