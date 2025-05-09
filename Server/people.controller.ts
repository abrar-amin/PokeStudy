// @ts-nocheck

import { db } from "./firebase";
import { User } from "../common/types";

const userCollectionRef = db.collection("users");

export const adduser = async (userid: string, name : string) => {
    const pokemonID = Math.floor(Math.random() * 1000);
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonID, {
        method: 'GET',
        mode: 'cors', 
        headers: {
        }
        });

    if(!response.ok)
    {
        return null;
    }
    const data = await response.json();
    if(data.sprites.other.showdown.front_default != null)
    {
      const newDoc = userCollectionRef.doc(userid, {"Pokemon": data.name, "URL" : data.sprites.other.showdown.front_default, "Pomodoros" : 0, "Name" : name});
      return await newDoc.set({"Pokemon": data.name, "URL" : data.sprites.other.showdown.front_default, "Pomodoros" : 0, "Name" : name});
    }

    const newDoc = userCollectionRef.doc(userid, {"Pokemon": data.name, "URL" : data.sprites.front_default, "Pomodoros" : 0, "Name" : name});
    return await newDoc.set({"Pokemon": data.name, "URL" : data.sprites.front_default, "Pomodoros" : 0, "Name" : name});
    
};


export const updatePomodoro = async (userid: string, amount : number) => {
    if(amount == 0)
    {
      //Reset
      return await userCollectionRef
      .doc(userid)
      .update( {Pomodoros: 0});
    }

    else
    {
      
      return await userCollectionRef
      .doc(userid)
      .update( {Pomodoros: (amount + (await userCollectionRef.doc(userid).get()).data().Pomodoros)});
    }
    
  };

export const getUsers = async () => {
  const snapshot = await db.collection("users").get();
  let users = {};
  snapshot.forEach((doc) => {
    console.log(doc.data());
    users[doc.id] = doc.data();
  });

  return users
};

export const getUser = async (userid: string) => {
  const doc = await userCollectionRef.doc(userid).get();
  if (doc.exists) {
    return doc.data();
  } else {
    return null;
  }
};


export const deleteUser = async (userid: string) => {
  return await peopleCollectionRef.doc(userid).delete();
};