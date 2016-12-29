"use strict"

const request = require('request'),
      cheerio = require('cheerio'),

// import the discord.js module
      Discord = require('discord.js'),

// create an instance of a Discord Client, and call it bot
      bot = new Discord.Client(),

// the token of your bot - https://discordapp.com/developers/applications/me
      token = require('./token.json'),
 
      numotgamingCardsUrl = "http://www.numotgaming.com/cards/",
      searchUrl = `${numotgamingCardsUrl}?filters=true&view=list&search=`,
      cardUrl = `${numotgamingCardsUrl}images/cards/`,
      detailUrl = numotgamingCardsUrl,
      reCardCapture = /\[\[(.*)\]\]/,
      limit = 5;

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
    console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {
    // if the message is "ping",
    if (message.content === 'ping') {
        // send "pong" to the same channel.
        message.channel.sendMessage('pong');
    }
    else if (message.content.startsWith("[[") && message.content.endsWith("]]")) {
        logCardMessage(message);

        let searchTerm = reCardCapture.exec(message.content)[1];

        request.get(searchUrl + searchTerm, (function (err, response, body) {
            if(err) throw err;

            const $ = cheerio.load(body),
                  results = $("#table-cards tbody tr");

            if(results.length > 1) {
                message.channel.sendMessage(getResultsMessage(results));
            }

            // send a message for each row
            results.each(function (i) {
                if(i >= limit) return false; // don't flood the room with out of control queries

                let columns = $(this).find('td');
                message.channel.sendMessage(getCardInfo(columns));
            });
        }));
    }
    else if (message.content === '!help') {
        message.channel.sendMessage('Type [[search term]] to get card information');
    }
});

const getResultsMessage = function (results, limit) {
    return `${results.length > limit? limit : results.length} result(s)${results.length > limit?` of ${results.length} (refine your search)`:''}`;
};

const logCardMessage = function (message) {
    console.log(`Returning results for ${message.content} to ${message.author.username} in ${message.channel.name? '#' + message.channel.name : 'the DMs'}`);
};

// returns a formatted row for each card
const getCardInfo = function (columns) {
    let result = [];

    result.push(getCardName(columns.eq(0)));
    result.push(getCardCost(columns.eq(1)));
    result.push(getCardAttackHealth(columns.eq(2)));
    result.push(getCardType(columns.eq(3)));
    result.push(getCardRarity(columns.eq(4)));
    result.push(getCardImageUrl(columns.eq(0)));
    result.push(getCardDetailUrl(columns.eq(0), columns.eq(5), columns.eq(6)));

    return result.join(' | ');
};

// returns the name of the card
const getCardName = function (column) {
    return `**${column.text()}**`;
};

// returns the cost of the card
const getCardCost = function (column) {
    return (column.text() + parseInfluence(column)) || ' - ';
};

// returns the attack / health of the card or '-' for non units
const getCardAttackHealth = function (column) {
    return column.text() || ' - ';
};

// returns the type of the card
const getCardType = function (column) {
    return column.text();
};

// returns the card's rarity as words
const getCardRarity = function (column) {
    let rarity = `${removeClassNamesThatBeginWithIcon(column.find('i').attr('class')).join('').toLowerCase()}`;
    return rarity ? `*${rarity}*`: ' - ';
};

// returns the url for the card's image
const getCardImageUrl = function (column) {
    return `${cardUrl}${encodeURI(column.text())}.png`;
};

// returns the url for the card's detail
const getCardDetailUrl = function (nameColumn, setColumn, numberColumn) {
    return `${detailUrl}${setColumn.text()}/${numberColumn.text()}/${encodeURI(nameColumn.text())}`;
};

// turns the influence icons into letters
const parseInfluence = function (column) {
    return column.find('i').map(function (i, element){
        return removeClassNamesThatBeginWithIcon(element.attribs.class);
    }).get().join('').toUpperCase();
};

// takes the class attribute and removes all classes that begin with icon; what remains is returned
const removeClassNamesThatBeginWithIcon = function (className) {
    return className ? className.split(' ').filter(function (className){
        return !className.startsWith('icon');
    }) : [];
};

// log our bot in
bot.login(token);