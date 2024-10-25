import express from "express"

const app= express()


app.get("/", (req,res)=>{
    res.jsonO("this is the backend")
})

app.listen(8800, ()=>{
    console.log("Connected to backend")
})