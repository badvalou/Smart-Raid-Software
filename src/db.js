/**
 * Project : Smart-raid
 * IUT de Roanne - RT 2020
 * Team : Léo - Valentin - Bastien - Alex - Khadidia
 * Projet basé sur : https://github.com/deskfiler/deskfiler
 */
'user strict';

var mysql = require('mysql')

// Uniquement pour le projet (utilisation d'une API nécessaire pour construire le projet)
var connection = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});

module.exports = connection
