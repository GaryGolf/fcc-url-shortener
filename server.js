const http = require('http')
const path = require('path')
const express = require('express')
const mongo = require('mongodb').MongoClient
const app = express()
const mongoUrl = 'mongodb://localhost:27017/shortener'

app.set('port', (process.env.PORT || 8080))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/:id', (req, res) => {
    mongo.connect(mongoUrl, (error, db) => {
        if(error) {
            console.error(error)
            return res.sendStatus(404)
        }
        var id = 0
        const collection = db.collection('urls')
        
        try {
            id = Number.parseInt(req.params.id)    
        } catch(e) {
            console.error(e)
            return res.sendStatus(404)
        }
        collection.find({id: id}).toArray((error, doc) =>{
            if(error) {
                console.error(error)
                return res.sendStatus(404)
            }
            if(!doc.length) return res.sendStatus(404)
            db.close()
            res.redirect(301, doc[0].url)
        })
    })
})

app.get('*', (req, res) => {
    
    if(!req.url.startsWith('/new/')) return res.sendStatus(404)
    const url = req.url.substr(5)
    
    mongo.connect(mongoUrl, (error, db) => {
        if(error){
            console.error(error)
            return res.sendStatus(404)
        }
        const collection = db.collection('urls')
        
        collection.count((error, count) =>{
            if(error){
                console.error(error)
                return res.sendStatus(404)
            }
            // console.log(count+'  ' +JSON.stringify(req.url))
            collection.insertOne({id:count, url: url})
            db.close()
            res.set({ 'content-type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({
                original_url: url,
                short_url: 'https://fcc-url-shortener-garygolf.c9users.io/'+count
            }))    
        })
    })
})

const port = app.get('port')
http.createServer(app).listen(port, () => {
    console.log('http server starts on port 8080')
})