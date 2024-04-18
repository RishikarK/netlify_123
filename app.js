const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./src/js/mongod")
const port = 3000
const cors=require('cors')

//Allows all the ip address to acess the website 
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const TemplatesPath = path.join(__dirname, './Templates')
const publicPath = path.join(__dirname, './public')
// console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', TemplatesPath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/home', (req, res) => {
    res.render('home')
})
app.get('/plant', (req, res) => {
    res.render('plant')
})
app.get('/resources', (req, res) => {
    res.render('resources')
})
app.get('/Tools', (req, res) => {
    res.render('Tools')
})
app.get('/Community', (req, res) => {
    res.render('Community')
})
app.get('/Communityy', (req, res) => {
    res.render('Communityy')
})

const bcrypt = require('bcrypt');

// Signup route
app.post('/signup', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await LogInCollection.findOne({ name: req.body.name });

        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const newUser = new LogInCollection({
            name: req.body.name,
            password: hashedPassword // Store hashed password
        });

        await newUser.save();
        res.status(201).render("home", { naming: req.body.name });
    } catch (error) {
        console.error("Error in sign-up:", error);
        res.status(500).send("Server error");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        // Find the user by username
        const user = await LogInCollection.findOne({ name: req.body.name });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (isPasswordValid) {
            // Successful login
            res.status(200).render("home", { naming: req.body.name });
        } else {
            res.status(401).send("Incorrect password");
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Server error");
    }
});


app.listen(port, () => {
    console.log('port connected');
    console.log(`Application is run on the url : http://localhost:${port}`)
})