import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topics')
		.setDescription('show active topic threads'),
	async execute(interaction:CommandInteraction) {

		if(!interaction.guild) {
			await interaction.reply({content:"You need to be in a guild to use this command.",ephemeral:true});	
			return;
		}

		const emoji = interaction.guild.emojis.cache.random();

		let threadList:string[] = [];
		interaction.guild.channels.cache.forEach(channel=>{
			
			if(channel.isThread()) {
				threadList.push(`<#${channel.id}>`);
			}
		
		});
		
		let embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}`)
			.setColor(0xFFCC00)
			.setDescription((threadList.length > 0 ? threadList.join(`\n`) : "No threads found") + `\n\n${emoji}`);

		await interaction.reply({embeds:[embed],ephemeral:true});

		return;

	},

};