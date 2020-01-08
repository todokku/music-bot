'use strict';

/**
 * Module dependencies.
 */
const RemoveSongEmbed = require('../embeds/RemoveSongEmbed');
const ErrorEmbed = require('../embeds/ErrorEmbed');

/**
 * Remove command.
 */
const remove = {
    name: 'remove',
    description: 'Remove from the queue the song at position index',
    execute(message, arg, musicBot) {
        const serverQueue = musicBot.queue.get(message.guild.id);

		if (!serverQueue)
			return message.channel.send(new ErrorEmbed('There is no song that I could remove!'));

		if (/^(-|\+)?(\d+|Infinity)$/.test(arg)) {
			const index = parseInt(arg);
			if (index >= 1 && serverQueue.songs.length > index) {
				message.channel.send(new RemoveSongEmbed(serverQueue.songs[index]));
				serverQueue.songs.splice(index, 1);
			}
		} else {
			message.channel.send(new ErrorEmbed('Index must be a number greater than zero!'));
		}
	}
}

/**
 * Module exports.
 */
module.exports = remove;
