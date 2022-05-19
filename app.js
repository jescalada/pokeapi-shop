const express = require('express')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({
    extended: true
}))

// Tells our app to keep in mind the folder called "public", where we have various assets
app.use(express.static(__dirname + '/public'))

const pokemonSchema = new mongoose.Schema({
    name: String,
    types: [String],
    abilities: [String],
    id: Number,
    stats: [Object],
    sprite: String
}, { collection: 'pokemon' })

const pokemonModel = mongoose.model("pokemon", pokemonSchema);

const timelineSchema = new mongoose.Schema({
    query: String,
    timestamp: Date
}, { collection: 'timeline' })

const timelineModel = mongoose.model("timeline", timelineSchema);

mongoose.connect("mongodb+srv://juan:Rocco123@cluster0.nxfhi.mongodb.net/pokemon-db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.sendFile('public/index.html')
})

app.get('/pokemon/:pokemonId', (req, res) => {
    pokemonModel.find({ id: req.params.pokemonId }, function (err, pokemon) {
        if (err) {
            console.log("Error " + err)
        }
        res.json(pokemon)
    });
})

app.get('/name/:pokemonName', (req, res) => {
    pokemonModel.find({
        name: req.params.pokemonName
    }, function (err, pokemon) {
        if (err) {
            console.log("Error: " + err)
        }
        // Writes an entry object to the timeline
        let entry = {
            query: `/name/${req.params.pokemonName}`,
            timestamp: Date.now()
        }
        timelineModel.insertMany(entry, () => {
            res.json(pokemon)
        })
    });
})

app.get('/type/:pokemonType', (req, res) => {
    pokemonModel.find({
        types: {
            $in: req.params.pokemonType
        }
    }, function (err, pokemon) {
        if (err) {
            console.log("Error " + err)
        }
        // Writes an entry object to the timeline
        let entry = {
            query: `/type/${req.params.pokemonType}`,
            timestamp: Date.now()
        }
        timelineModel.insertMany(entry, () => {
            res.json(pokemon)
        })
    });
})

app.get('/ability/:pokemonAbility', (req, res) => {
    pokemonModel.find({
        abilities: {
            $in: req.params.pokemonAbility
        }
    }, function (err, pokemon) {
        if (err) {
            console.log("Error " + err)
        }
        // Writes an entry object to the timeline
        let entry = {
            query: `/ability/${req.params.pokemonAbility}`,
            timestamp: Date.now()
        }
        timelineModel.insertMany(entry, () => {
            res.json(pokemon)
        })
    });
})

app.get('/timeline', (req, res) => {
    timelineModel.find({}, (err, entries) => {
        if (err) {
            console.log("Error " + err)
        }
        res.json(entries)
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})