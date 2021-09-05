import {Client} from "discord.js";

module.exports = {
	name: 'ready',
	once: false,
	execute(client:Client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};