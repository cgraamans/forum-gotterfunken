import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";
import discord from "../services/discord";

const data = new SlashCommandBuilder()
	.setName('country')
	.setDescription('EU country of residence');

module.exports = {
	data: data,
	async execute(interaction:BaseCommandInteraction) {
		await interaction.deferReply();
		await interaction.editReply('Pong!');
	},
};