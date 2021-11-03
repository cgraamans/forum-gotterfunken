import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction:CommandInteraction) {

		const emoji = interaction.guild.emojis.cache.random();

		let embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Help`)
			.setColor(0xFFCC00)
			.setFooter(`Find me on https://twitter.com/eunewsbot `)
			.setDescription(`${emoji}
\`\`\`
	
	/help - this help
	/ping - test the bot

	/topics - get current topics
	/news - get news

	/calendar - list calendar entries
	/events - list events

	/country - list countries

\`\`\`
			`);

		await interaction.reply({embeds:[embed],ephemeral:true});
		
	},
};