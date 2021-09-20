import { SlashCommandBuilder, } from "@discordjs/builders";
import discord from "../services/discord";
import google from "../services/google";

const data = new SlashCommandBuilder()
	.setName('calendar')
	.setDescription('Get the Götterfunken calendar');

data.addStringOption(option => 
	option
		.setName('span')
		.setDescription('Number of days')
		.addChoice('Today', 'today')
		.addChoice('Tomorrow', 'tomorrow')
		.addChoice('7 days', '7d')
		.addChoice('14 days', '14d')
		.addChoice('28 days', '28d')
);

module.exports = {

	data: data,

	async execute(interaction:any) {

		return;

	},
};