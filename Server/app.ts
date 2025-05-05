// @ts-nocheck

import express, { Express } from "express";
const admin = require('firebase-admin');
const serviceAccount = require('./service_account.json');
import cors from "cors";
import { addPerson, getUsers, getPerson, getCertainAge, updateAge, deletePerson, adduser, getUser, updatePomodoro } from "./people.controller";
import { Person } from "../common/types";

const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());



app.get("/api/user/pokemon", async (req, res) => {
  console.log("[GET] entering 'user/pokemon' endpoint");
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    let user = await getUser(decodedToken.uid);
    if(user === null)
    {
      const uid = decodedToken.uid;
  
      const userRecord = await admin.auth().getUser(uid);
      const displayName = userRecord.displayName || '';
      user = await adduser(decodedToken.uid, displayName);
    }

    user = await getUser(decodedToken.uid);
    return res.status(200).json({"Pokemon" : user.Pokemon, "Image" : user.URL, "Pomodoros" : user.Pomodoros});
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
    
  
});

app.post("/api/user/pomodoros", async (req, res) => {
  console.log("[POST] entering 'api/user/pomodoros' endpoint");
  try {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const newCount = req.body.count;

    await updatePomodoro(decodedToken.uid, newCount);

    res.status(200).send({
      message: `SUCCESS updated Pomodoro Count`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred in the api/user/pomodoros endpoint: ${err}`,
    });
  }
});


app.delete("/api/user/pomodoros", async (req, res) => {
  console.log("[POST] entering 'api/user/pomodoros' endpoint");
  try {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const newCount = req.body.count;
    
    await updatePomodoro(decodedToken.uid, 0);

    res.status(200).send({
      message: `SUCCESS deleted Pomodoro Count`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred in the api/user/pomodoros endpoint: ${err}`,
    });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  console.log("[GET] leaderboard endpoint");

  try {
    const users = await getUsers();
    res.status(200).send({
      message: `SUCCESS`,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred in the /api/people endpoint: ${err}`,
    });
  }
});




app.listen(port, () => {
  console.log(`SERVER listening on port ${port}`);
});
