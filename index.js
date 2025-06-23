//Import required modules
const { Client, GatewayIntentBits} = require('discord.js');
const axios = require('axios');
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

//Listen and respond to messages
client.on('messageCreate', async(message) => {

    console.log("Recieved a message");

    //Ignore messages from bots
    if(message.author.bot) return;

    //Respond to a specific message
    if(message.content.toLowerCase() == 'hello') {
        message.reply('Hi there! 👋 I am your friendly bot.');
    }

    if(message.content.toLowerCase() == '!quote'){
        const response = await axios.get('http://localhost:3000/quote')
            .then(response =>{
                console.log(response);
                console.log(response.data);
                //const test = response.data.products[0];
                //message.reply(`You have ${test.stock} ${test.title}`)
                
                //reply to message
                message.reply(`${response.data.quote}`)
                //send new message
                client.channels.cache.get('934956511254446100').send(`${response.data.quote}`);
            })
            .catch(error =>{
               console.error('Error fetching data: ', error);
            });
        
        //console.log(response.data.content);
    }

    if(message.content.toLocaleLowerCase() == '!addquote'){
        console.log("Adding Quote To Database.....");
    }
});

//Log in to Discord using token from .env
client.login(process.env.DISCORD_TOKEN)