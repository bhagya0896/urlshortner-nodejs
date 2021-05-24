const express = require('express');
const app= express();
require('dotenv').config();
const mongodb = require('mongodb');
const ShortUrl = require('./model')
const mongoose = require('mongoose')

const dbUrl = process.env.DB_URL;
const port = process.env.PORT || 5000

mongoose.connect(dbUrl, {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.urlencoded({extented:false}))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
  })

app.post('/shortUrls' , async(req,res) =>
{
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})


app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
app.listen(port , ()=>
{
    console.log("App started running!!")
})