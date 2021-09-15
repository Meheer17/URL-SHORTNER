require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url')

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Basic Configuratin
const port = process.env.PORT || 3000;
const schema = mongoose.Schema({url : 'string'});
const Url = mongoose.model('url', schema);
console.log(mongoose.connection.readyState)
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
        console.log(req.body);
        const burl = req.body.url;


        dns.lookup(burl, callback);
        const url = new Url({url: burl});
 
  //12.56
  
  await url.save((err, data) => {
          res.json({created: true})
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
