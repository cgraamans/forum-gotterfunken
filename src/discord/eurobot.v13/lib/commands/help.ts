import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";
import Discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction:any) {

		await interaction.reply({content:`Eurobot Help
		
		**Commands**
		/help - this help
		/ping - test the bot

		/news - get news
		/calendar - get calendar

		/country - set your country
		/register - get the registered role
		`,ephemeral:true});
	},
};