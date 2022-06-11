const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
//process.env.PORT is for heroku server
// const port = process.env.PORT || 3000;

const app = express();

// The below code specifies the static pages like css
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/sign-up.html");
})

app.post("/", function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data)

    const url = "https://us8.api.mailchimp.com/3.0/lists/aa39a67a34"

    const options = {
        method: "POST",
        auth: "ayush:f37b9d8d4de1096fe0eccb9825500b84-us8"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

// Redirect if failed
app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT, function(req, res){
    console.log("The server is running on port 3000");
})


// API Key
// f37b9d8d4de1096fe0eccb9825500b84-us8

// Audience Id
// aa39a67a34