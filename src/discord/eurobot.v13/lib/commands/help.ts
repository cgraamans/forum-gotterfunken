import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction, Interaction, MessageEmbed } from "discord.js";
import discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction:BaseCommandInteraction) {

		const emoji = interaction.guild.emojis.cache.random();

		let embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Help`)
			.setColor(0xFFCC00)
			.setFooter(`Find me on https://twitter.com/eunewsbot `)
			.setDescription(`\`\`\`
	/help - this help
	/ping - test the bot

	/news - get news
	/calendar - get calendar

	/country - set your country
	/register - get the registered role\`\`\`
	${emoji}
	`)

		await interaction.reply({embeds:[embed],ephemeral:true});
	},
};