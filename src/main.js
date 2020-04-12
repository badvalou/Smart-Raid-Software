/**
 * Project : Smart-raid
 * IUT de Roanne - RT 2020
 * Team : Léo - Valentin - Bastien - Alex - Khadidia
 * Projet basé sur : https://github.com/deskfiler/deskfiler
 */
const { app, BrowserWindow } = require('electron')
const setupPug = require('electron-pug')
const { getMainWindow, createMainWindow} = require('./windows')

//https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true

// Evenement émis lorsqu' Electron a terminé l’initialisation
// permet l'initialisation de pug puis la creation de la page principale
app.on('ready', async () => {
  try {
    let pug = await setupPug({pretty: true}, './views')
    pug.on('error', err => console.error('electron-pug error', err))
  } catch (err) {

  }
  createMainWindow()
})

// Evenement émis lorsque l'application est activée
app.on('activate', () => {
  const mainWindow = getMainWindow(); // on recupere l'objet depuis windows.js
  if (mainWindow === null) { // si elle est nul 
    createMainWindow() // on creer une fenetre
  }
})

app.on('restart-app', () => {
  app.relaunch()
});

// Evenement émis lorsque toutes les fenêtres ont été fermées.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
