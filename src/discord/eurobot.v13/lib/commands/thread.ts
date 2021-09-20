import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";
import Discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thread')
		.setDescription('Replies with Pong!'),
	async execute(interaction:BaseCommandInteraction) {
		await interaction.deferReply();

            // new

            // unarchive <thread name?>

            // archive

            // delete

		await interaction.editReply('Pong!');

	},

};