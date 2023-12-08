const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const fs = require("fs");

app.get('/garage/get', function (req, res) {
    fs.readFile( __dirname + "/" + "garage.json", 'utf8', function (err, data) {
        console.log( data );
        res.setHeader('content-type', 'application/json');
        res.end( data );
    });
})

app.get('/ftmt/year', function (req, res) {
    fs.readFile( __dirname + "/" + "years.json", 'utf8', function (err, data) {
        console.log( data );
        res.setHeader('content-type', 'application/json');
        res.end( data );
    });
})

app.get('/ftmt/brand', function (req, res) {
    fs.readFile( __dirname + "/" + "brands.json", 'utf8', function (err, data) {
        console.log( data );
        res.setHeader('content-type', 'application/json');
        res.end( data );
    });
})

app.get('/ftmt/equipment', function (req, res) {
    fs.readFile( __dirname + "/" + "equips.json", 'utf8', function (err, data) {
        console.log( data );
        res.setHeader('content-type', 'application/json');
        res.end( data );
    });
})

app.get('/ftmt/model', function (req, res) {
    fs.readFile( __dirname + "/" + "models.json", 'utf8', function (err, data) {
        console.log( data );
        res.setHeader('content-type', 'application/json');
        res.end( data );
    });
})

const server = app.listen(8000, '0.0.0.0',function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})