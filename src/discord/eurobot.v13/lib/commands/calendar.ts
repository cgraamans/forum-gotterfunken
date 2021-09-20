import { SlashCommandBuilder, } from "@discordjs/builders";
import discord from "../services/discord";
import google from "../services/google";
import {Calendar} from  "../models/google";
import {Eurobot} from "../../types/index";

const data = new SlashCommandBuilder()
	.setName('calendar')
	.setDescription('Get the Götterfunken calendar');

data.addStringOption(option => 
	option
		.setName('timespan')
		.setDescription('Number of days')
		.addChoice('today', 'today')
		.addChoice('tomorrow', 'tomorrow')
		.addChoice('next 7 days', 'week')
);

module.exports = {

	data: data,

	async execute(interaction:any) {

		const model = new Calendar();

		// keyword
		let timespan = "today"
		const stringOption = interaction.options.getString('timespan');
		if(stringOption) timespan = stringOption;

		const span:Eurobot.Calendar.Span = model.textToUnixTimeRange(timespan);
		const items = await google.Calendar(span.range)

		let embed = model.toRich(items,span);

		return;



	},
};