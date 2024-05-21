import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({message:"Ok done!!"})
})

app.get("/profile/:username/:age", (req, res) => {
    console.log(req.params)
    const { username, age } = req.params;
    res.json({message:`username is ${username} and age is ${age}`})
})


export default app;
