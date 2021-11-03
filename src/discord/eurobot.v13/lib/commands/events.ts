import { SlashCommandBuilder } from "@discordjs/builders";
import discord from "../services/discord";
import google from "../services/google";
import {Calendar} from  "../models/google";
import {Eurobot} from "../../types/index";
import { CommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('events')
	.setDescription('Get the Götterfunken events calendar');

data.addStringOption(option => 
	option
		.setName('timespan')
		.setDescription('Number of days')
		.addChoice('today', 'today')
		.addChoice('tomorrow', 'tomorrow')
		.addChoice('7 days', '7d')
		.addChoice('14 days', '14d')
);

module.exports = {

	data: data,

	async execute(interaction:CommandInteraction) {

		const model = new Calendar();

		// keyword
		let timespan = "7d"
		const stringOption = interaction.options.getString('timespan');
		if(stringOption) timespan = stringOption;

		const span:Eurobot.Calendar.Span = model.textToUnixTimeRange(timespan);
		let items:any[] = await google.Calendar(span.range)

		items = items.filter(item=>item.start.dateTime)

		let embed = model.toRich(items,span);

		interaction.reply({embeds:[embed],ephemeral:true});

		return;

	},
};