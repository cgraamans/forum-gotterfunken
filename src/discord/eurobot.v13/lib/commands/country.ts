import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { MessageEmbed, CommandInteraction } from "discord.js";
import discord from "../services/discord";

const data = new SlashCommandBuilder()
	.setName('country')
	.setDescription('Country of residence');

data.addStringOption((option:SlashCommandStringOption)=>{
	option.setName('country')
		.setDescription('Country Name');
	return option;

});

module.exports = {
	data: data,
	async execute(interaction:CommandInteraction) {

		const embed = new MessageEmbed();
		embed.setColor(0x001489);

		const stringOption = interaction.options.getString('country');
		if(!stringOption) {

			let description:string[] = [];
			
			const countries = discord.Config.Roles.Countries.filter(x=>!x.isAlias);
			countries.forEach(country=>{

				const role = interaction.guild.roles.cache.find(role=>role.id === country.role_id);
				if(role) {
				
					description.push(`${country.emoji} ${country.alias}`);
				
				}
			
			});

			embed.setDescription(description.length > 0 ? description.join(`\n`) : 'This server does not support countries.');
			embed.setTitle("Available countries");

			await interaction.reply({embeds:[embed],ephemeral:true});

			return;

		}

		const countryObjs = discord.Config.Roles.Countries.filter(c=>c.alias.toLowerCase() === stringOption.toLowerCase());
		if(countryObjs.length < 1) {

			embed.setDescription(`Country not found.`);

			await interaction.reply({embeds:[embed],ephemeral:true});

			return;

		}

		console.log(countryObjs);

		
		const countryObj = countryObjs[0];
		const role = interaction.guild.roles.cache.find(role=>role.id === countryObj.role_id);
		if(!role) {

			embed.setDescription(`Country role not found.`);

			await interaction.reply({embeds:[embed],ephemeral:true});

			return;
			
		}
		
		// interaction.guild.members.cache.find
		
		await interaction.deferReply();
		await interaction.editReply('Pong!');

	},

};