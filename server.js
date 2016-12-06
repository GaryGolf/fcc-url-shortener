const http = require('http')
const express = require('express')

const app = express()

app.set('port', process.env.PORT || 8080)

app.get('/new/:url', (req, res) => {

    res.end(req.params.url)
})

const port = app.get('port')
http.createServer(app).listen(8080, () => {
    console.log('http server starts on port 8080')
})