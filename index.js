const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");  
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://TUSHAR090:${password}@cluster0.nejqjm9.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = new mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({email : email});
        if(!existingUser)
        {
            const registrationData = new Registration({
                name,
                email,
                password
            });
          await registrationData.save();
            res.redirect('/success');
        }
        else{
            alert("user already exists");
            res.redirect("/error");
        }

    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
