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

app.on('ready', async () => {
  try {
    let pug = await setupPug({pretty: true}, './views')
    pug.on('error', err => console.error('electron-pug error', err))
  } catch (err) {

  }
  createMainWindow()
})

app.on('activate', () => {
  const mainWindow = getMainWindow();
  if (mainWindow === null) {
    createMainWindow()
  }
})

app.on('restart-app', () => {
  app.relaunch()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
