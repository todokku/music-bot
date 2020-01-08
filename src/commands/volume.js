'use strict';

const VolumeEmbed = require('../embeds/VolumeEmbed');
const ErrorEmbed = require('../embeds/ErrorEmbed');

/**
 * Volume command.
 */
const volume = {
    name: 'volume',
    description: 'Change music volume',
	execute(message, arg, musicBot) {
		const serverQueue = musicBot.queue.get(message.guild.id);
		
		if (!serverQueue)
			return message.channel.send(new ErrorEmbed('There\'s no song currently played, couldn\'t change volume'));

		const nbr = parseInt(arg, 10);
		if (nbr !== NaN && (nbr >= 0 && nbr <= 100)) {
			message.channel.send(new VolumeEmbed(serverQueue.volume * 50, nbr));
			serverQueue.volume = nbr / 50;

			const dispatcher = serverQueue.connection.dispatcher;
			if (dispatcher) dispatcher.setVolumeLogarithmic(serverQueue.volume);
		} else {
			message.channel.send(new ErrorEmbed('Volume must be a number between `0` and `100`!'));
		}
	}
}

/**
 * Module exports.
 */
module.exports = volume;