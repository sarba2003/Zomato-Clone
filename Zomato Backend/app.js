const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./Route/index");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieSession = require("cookie-session");

const PORT = 5500;
const paymentRoute = require("./Controller/payment");
const authRoute = require("./Controller/auth");
const passportSetup = require("./Controller/passport");

const corsOptions = {
    origin: "http://localhost:3000" ,
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders: "X-Requested-With,content-type, x-token, Access-Control-Allow-Credentials"
}

dotenv.config();
const app = express();

app.use(cookieSession({ name: "session", keys:["edureka"], maxAge: 24*60*60*1000 }))

app.use(express.json());       
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.options('*', cors());
app.use('/', route);
app.use('/api/payment/', paymentRoute);
app.use('/auth', authRoute);

// DB
const MongoAtlas = "mongodb+srv://sarba2003:tyWwRnVEVoCzsUrT@cluster0.vwu6gla.mongodb.net/Zomato-Backend?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(MongoAtlas)   

    .then(res => {
        app.listen(PORT, () => {       
            console.log(`Server is running at ${PORT}`)
        });
    })
    .catch(err => console.log(err));


 