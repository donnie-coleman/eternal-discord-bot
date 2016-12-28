# eternal-discord-bot

This is a [Discord](https://discordapp.com/) [app/bot](https://discordapp.com/developers/docs/intro) running on [Node v6+](https://nodejs.org/en/), using [discord.js](https://discord.js.org/#/), [cheerio](https://cheerio.js.org/), and [request](https://www.npmjs.com/package/request) to scrape the [search results page](http://www.numotgaming.com/cards/) of [Numot Gaming's website](http://www.numotgaming.com/) for the [Eternal](https://www.eternalcardgame.com/) strategy card game.

# Running Eternal Bot
[Set up a Discord Bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) to get a token.
Run the app (locally or whatever)
```bash
# make sure Node v6+ is installed
git clone # this repo
cd eternal-discord-bot
npm install # get the node modules
node index.js # start the app
```
Enjoy.

Type `[[search term]]` to get card information

Notes: 
* Doesn't show card text, yet...
* Search results are limited to 5.  
* There's a bug in Discored with previewing images whose path contains a space.
