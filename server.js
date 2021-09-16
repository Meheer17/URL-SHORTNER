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
app.post('/api/shorturl', function(req, res) {
        console.log(req.body)
        const burl = req.body.url
        
        const sm = dns.lookup(urlparser.parse(burl).hostname,
        (error, address) => {
                if(!address){
                        res.json({error: "invalid url"})
                } else {
                        const url = new Url({url: burl})
                        url.save((err, data) => {
                               res.json({
                                original_url : data.url,
                                short_url : data.id
                               })
                        })
                }
                console.log("dns", error)
                console.log("address", address)
        })
        console.log("sm", sm)
});

app.get("/api/shorturl/:id", (req,res) => {
        const id = req.params.id;
        Url.findById(id, (err, data) => {
                if(!data){
                        res.json({error: "invalid url" })
                } else {
                        res.redirect(data.url)
                }
        })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
