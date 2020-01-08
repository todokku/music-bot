'use strict';

/**
 * Module dependencies.
 */
const Discord = require('discord.js');
const fs = require('fs');

/** Core class of the module. */
class MusicBot {
	/**
	 * discordToken and googleKey attributes are mandatory.
	 * 
	 * @param {Object} options
	 */
	constructor(options) {
		if (!options || !options.discordToken || !options.googleKey) {
			throw 'Error: wrong options given';
		}
		
		this.discordToken = options.discordToken;
		this.googleKey = options.googleKey;
		this.prefix = options.prefix || '!!';

		this.queue = new Map();

		this.setup_();
	}

	/**
	 * Starts bot.
	 * 
	 * @api public
	 */
	start() {
		this.client.login(this.discordToken);
	}

	/**
	 * Setup bot.
	 * 
	 * @api private
	 */
	setup_() {
		this.client = new Discord.Client();
		this.client.commands = new Discord.Collection();

		const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			this.client.commands.set(command.name, command);
		}

		this.client.once('ready', () => {
			console.log('Bot is ready!');
			this.client.user.setActivity(`${this.prefix}help`);
		});

		this.client.on('message', message => {
			if (message.author.bot || !message.content.startsWith(this.prefix)) return;

			const args = message.content.slice(this.prefix.length).split(/ +/);
			const command = args.shift().toLowerCase();

			const arg = args.join(' ');

			if (!this.client.commands.has(command)) return;

			try {
				this.client.commands.get(command).execute(message, arg, this);
			} catch (err) {
				console.error(err);
			}
		});
	}
}

/**
 * Module exports.
 */
module.exports = MusicBot;
