const express = require('express')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const path = require('path')
const {
    getEnabledCategories
} = require('trace_events')

const app = express()
const port = process.env.PORT || 3000

const session = require('express-session')

app.use(bodyparser.json())

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}))

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
}, {
    collection: 'pokemon'
})

const pokemonModel = mongoose.model("pokemon", pokemonSchema);

const timelineSchema = new mongoose.Schema({
    query: String,
    timestamp: Date
}, {
    collection: 'timeline'
})

const timelineModel = mongoose.model("timeline", timelineSchema);

const usersSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    password: String,
    cart: [Object],
    past_orders: [
        [Object]
    ],
    timeline: [Object]
}, {
    collection: 'users'
})

const usersModel = mongoose.model("users", usersSchema);

mongoose.connect("mongodb+srv://juan:Rocco123@cluster0.nxfhi.mongodb.net/pokemon-db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    if (req.session.authenticated) {
        console.log("Authenticated!")
        res.sendFile(__dirname + '/public/landing.html')
    } else {
        console.log("Not Authenticated!")
        res.redirect('/login')
    }
})

app.get('/login', (req, res) => {
    // If they're authenticated, send them to their profile, otherwise send them to the login page
    if (req.session.authenticated) {
        res.redirect('/profile')
    } else {
        res.sendFile(__dirname + '/public/login.html')
    }
})

app.post('/login', async (req, res) => {
    await authenticateLogin(req.body.username, req.body.password).then(user => {
        req.session.user = user
    })
    console.log(req.session.user)
    req.session.authenticated = req.session.user != null
    res.json({
        success: req.session.authenticated,
        user: req.session.user,
        message: req.session.authenticated ? "Authentication success." : "Authentication failed."
    })
})

async function authenticateLogin(username, password) {
    const users = await usersModel.find({
        username: username,
        password: password
    })
    return users[0]
}

// POST route for registering. Adds a user to the database
app.post('/register', (req, res) => {
    
})

app.get('/profile', (req, res) => {
    if (req.session.authenticated) {
        res.sendFile(__dirname + '/public/profile.html')
    } else {
        res.redirect('/login')
    }
})

app.get('/pokemon/:pokemonId', (req, res) => {
    pokemonModel.find({
        id: req.params.pokemonId
    }, function (err, pokemon) {
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

app.post('/addtocart', async (req, res) => {
    res.json(await updateCart(req.body.userId, req.body.quantity, req.body.pokemonId))
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.post('/cart', async (req, res) => {
    const user = await usersModel.find({
        user_id: req.body.userId
    })
    return res.json(user[0]);
})

async function updateCart(userId, quantity, pokemonId) {
    await usersModel.updateOne({
        userId: userId
    }, {
        $push: {
            cart: {
                quantity: quantity,
                pokemonId: pokemonId
            }
        }
    }).then(() => {
        return {
            success: true
        }
    })
}
