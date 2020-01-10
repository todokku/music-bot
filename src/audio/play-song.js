'use strict';

/**
 * Module dependencies.
 */
const ytdl = require('ytdl-core');
const PlaySongEmbed = require('../embeds/play-song-embed');

/**
 * Play a song on the user's voice channel.
 * Keep playing until the song queue is empty.
 *
 * @param {Discord.Message} message
 * @param {*} serverQueue
 * @param {*} queue
 */
const playSong = (message, serverQueue, queue) => {
	const song = serverQueue.songs[0];

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(message.guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url, {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25
	}))
		.on('start', () => {
			console.log('Music started!');
			message.channel.send(new PlaySongEmbed(song));
		})
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			playSong(message, serverQueue, queue);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume);
};

module.exports = playSong;
