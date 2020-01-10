'use strict';

/**
 * Module dependencies.
 */
const ytdl = require('ytdl-core');
const {YouTube} = require('better-youtube-api');

const AddSongEmbed = require('../embeds/add-song-embed');
const ErrorEmbed = require('../embeds/error-embed');

const playSong = require('../audio/play-song');

/**
 * Play command.
 */
const play = {
	name: 'play',
	description: 'Play the song given in argument or add it to the queue',
	async execute(message, arg, musicBot) {
		const {voiceChannel} = message.member;
		if (!voiceChannel) {
			return message.channel.send(new ErrorEmbed('You need to be in a voice channel to play music!'));
		}

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send(new ErrorEmbed('I need the permissions to join and speak in your voice channel!'));
		}

		const youtube = new YouTube(musicBot.googleKey);

		let songInfo = null;

		if (ytdl.validateURL(arg)) {
			songInfo = await ytdl.getInfo(arg);
		} else {
			const infos = await youtube.searchVideos(arg, 1);
			songInfo = await ytdl.getInfo(infos.results[0].url);
		}

		if (!songInfo) {
			message.channel.send(new ErrorEmbed('This song is restricted or couldn\'t be found!'));
			return;
		}

		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
			author: songInfo.author.name,
			thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url,
			duration: new Date(songInfo.length_seconds * 1000).toISOString().slice(11, 19)
		};

		const serverQueue = musicBot.queue.get(message.guild.id);

		if (serverQueue === undefined) {
			const newQueue = {
				voiceChannel,
				connection: null,
				songs: [],
				volume: 0.15
			};

			musicBot.queue.set(message.guild.id, newQueue);

			newQueue.songs.push(song);

			try {
				newQueue.connection = await voiceChannel.join();
				playSong(message, newQueue, musicBot.queue);
			} catch (error) {
				console.log(error);
				musicBot.queue.delete(message.guild.id);
				return message.channel.send(new ErrorEmbed('An error occured!'));
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send(new AddSongEmbed(song));
		}
	}
};

/**
 * Module exports.
 */
module.exports = play;
