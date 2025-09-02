const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const cors = require('cors');
const { spawn } = require('child_process');

app.use(cors());



// Define the Python script path
const pythonScript = 'trial.py';


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./uploads")
    },
    filename:function (req,file,cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({storage});


app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(express.json())
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/BEProject').then(() => {
    console.log("database is connected");
}).catch(err => {
    console.log(err);
});

const dishSchema = {

    dish_name: {type:String},
    dish_type: {type:String},
    region: {type:String},
    primary_ingredients: {type:[String]},
    secondary_ingredients: {type:[String]}


};

const dish = mongoose.model("newdish", dishSchema);


app.get("/search/:dishname", async function (req, res) {
    console.log("hello")
    dish.findOne({dish_name:req.params.dishname}).then((data)=>{

        // const d =JSON.stringify(data);
        res.json(data);
        console.log(data)

    })

});






app.post("/upload", upload.single("foodimg"), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);

    const imagePath = req.file.path;
    console.log(req.file.path);

    const pythonProcess = spawn('python', [pythonScript, imagePath]);
    let output = '';

    // Capture output from Python script
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
        // console.error(`Error from Python script: ${data}`);
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
        // console.log(`Python script exited with code ${code}`);
        const relevantOutput = output.trim().split('\n').pop().trim();
        console.log(`${relevantOutput}`);

        // Query the database using relevant output
        dish.findOne({ dish_name: relevantOutput }).then((data) => {
            const d = JSON.stringify(data);
            console.log(data);
            res.json(data);
            // res.status(200); // Send the database query result as JSON response
        }).catch((err) => {
            console.error("Error querying database:", err);
            res.status(500).json({ error: "Internal server error" }); // Send a 500 error response for internal server error
        });
    });
});






















































app.listen(8000, function () {
    console.log("server started on port 8000");
});









