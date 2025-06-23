const mongoose = require('mongoose');
require('dotenv').config();
const uri = `mongodb+srv://gtomasel20:${process.env.DB_PASSWORD}@quotecluster.nfqsjfu.mongodb.net/quotebot?retryWrites=true&w=majority&appName=QuoteCluster`;
const collectionName = 'recipes';
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

function SetUpSchema() {

    const quoteSchema = new mongoose.Schema({
            quote: String,
            author: String,
            dateCreated: {type: Date, default: Date.now}
    })
    
    quoteSchema.methods.print = function print() {
            const quote = this.author
            ? this.quote + ' by ' + this.author
            : this.quote;
            console.log(quote);
    }

     //Create a new model
    const quoteModel = mongoose.model('Quote', quoteSchema);

    return quoteModel;
}

const quoteModel = SetUpSchema();


async function saveQuote(newQuote) {
    if(quoteModel){
        //console.log('saving to db');
        const createdQuote = new quoteModel({quote: newQuote.quote, author: newQuote.author, dateCreated: newQuote.dateCreated});
        //console.log("Created quote: " + createdQuote);
        await mongoose.connect(uri, clientOptions);
        await createdQuote.save();
        await mongoose.disconnect();
    }else{
        console.log('no model found');
    }
}

async function getAllQuotes() {
    if(quoteModel){
        //console.log('connect to database');
        await mongoose.connect(uri, clientOptions);
        const quotes = await quoteModel.find();
        await mongoose.disconnect();
        return quotes;
    }else{
        console.log('no model found');
    }
}

async function getQuote(){
    if(quoteModel){
        //console.log('connect to database');
        await mongoose.connect(uri, clientOptions);
        const quotes = await quoteModel.find();
        await mongoose.disconnect();
        
        //get random quote
        const randomIndex = Math.floor(Math.random() * quotes.length);
        // console.log(randomIndex);
        // console.log("Test: " + quotes[randomIndex]);

        return quotes[randomIndex];
    }else{
        console.log('no model found');
    }
}

module.exports = {saveQuote, getQuote, getAllQuotes};