'use strict';

const PlaySongEmbed = require('./PlaySongEmbed');

/**
 * Add song embed.
 * 
 * @class
 * @extends PlaySongEmbed
 */
class AddSongEmbed extends PlaySongEmbed {
    constructor(song) {
        super(song);
        this.setTitle(':hourglass: Added to queue');
    }
}

module.exports = AddSongEmbed;
