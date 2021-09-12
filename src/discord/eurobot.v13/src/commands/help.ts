import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";
import Discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with Pong!'),
	async execute(interaction:BaseCommandInteraction) {
		await interaction.deferReply();
		await interaction.editReply('Pong!');
	},
};