import { BaseCommandInteraction } from "discord.js";
import NewsModel from "../models/news";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {

	data: new SlashCommandBuilder()
		.setName('news')
		.setDescription('Retrieves news from the Forum Gotterfunken network')
		.addUserOption(option => option.setName('source').setDescription('Keyword')),

	async execute(interaction:BaseCommandInteraction) {

		await interaction.deferReply();

		const news = new NewsModel();
		interaction.command.options.forEach(option=>{
			console.log(option);
		});

		// const results  = await news.get();

		await interaction.editReply('Pong!');

	},

};