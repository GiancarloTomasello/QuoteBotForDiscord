//Import required modules
const { Client, GatewayIntentBits} = require('discord.js');
const axios = require('axios');
const { getQuote, getAllQuotes, saveQuote} = require('./database');
const { response } = require('express');
require('dotenv').config();

//Create a new Discord Client with message intent
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

//Bot is ready
client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client

//Listen and respond to messages
client.on('messageCreate', async(message) => {

    //Ignore messages from bots
    if(message.author.bot) return;
    
    console.log("Recieved a message");
    
    //Respond to a specific message
    if(message.content.toLowerCase() == 'hello') {
        message.reply('Hi there! 👋 I am your friendly bot.');
    }

    //split string to edit
     commandString = message.content;

    if(commandString.slice(0,6).toLowerCase() == "!quote"){
        if(message.channelId != process.env.QUOTE_TEST_CHANNEL_ID){
            message.reply("Oops wrong channel. Please use the quote bot channel instead.");
            return;
        }

        const response = await getQuote()
            .then( response => {
                console.log(response);

                const chatMessage = response.author ? `${response.quote} ${response.author}` : `${response.quote}`
                message.reply(chatMessage)
                //client.channels.cache.get(`${process.env.QUOTE_CHANNEL_ID}`).send(chatMessage);
            })
            .catch(error => {
                console.log("Error fetching data: ", error);
            })
    }

    if(commandString.slice(0,9).toLowerCase() == "!addquote"){
        const quote = commandString.slice(9,commandString.length);
        const author = message.member.displayName;
        
        if(!quote){
            message.reply("No quote to add.")
            return;
        }

        console.log("Adding Quote To Database.....");

        await saveQuote({quote: quote, author: author})
            .then(() => {
                message.reply("Quote added to database");
            })
            .catch(error => {
                message.reply("Error adding quote to database");
                console.log("Unable to save quote: ", error);
            });
    }

});

//Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN)