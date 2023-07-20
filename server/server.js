import express from "express";
import * as dotenv from "dotenv";
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const configuration = new Configuration({
    organization: "org-c4wFgtS7aSxJyqdeOjUaK3HV",
    apiKey: process.env.OPENAI_API_KEY,
});
const app=express();
app.use(cors());
app.use(express.json());

app.get("/",async(req,res)=>{
    res.status(200).send({
        Message:"hello",
    })
});

app.post("/",async(req,res)=>{
    try{
        const prompt=req.body.prompt;
        const response=await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
          });
    
    res.status(200).send({
        bot:response.data.choices[0].text
    });
        }catch (error){
            res.status(500).send({error});
        }
});

app.listen(3000,() =>{
    console.log("server stated at port 3000");
})