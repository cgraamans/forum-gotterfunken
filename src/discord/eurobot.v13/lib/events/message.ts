import discord from "../services/discord";
import {Message,MessageEmbed, TextChannel, MessageOptions} from "discord.js";
import TwitterModel from "../models/twitter";
import DiscordModel from "../models/discord";
import Tools from '../tools';
import {Eurobot} from "../../types/index.d"
import * as os from 'os';

module.exports = {

	name: 'messageCreate',
	async execute(message:Message) {

		if(message.author.bot) return;

		// Routing
        if(message.channel && discord.Config.Routes) {

            let routing = discord.Config.Routes.filter(route=>route.from === message.channel.id)
            if(routing.length > 0) {

				const embed:MessageEmbed | string = new MessageEmbed()

				embed.setAuthor(message.author.username, message.author.avatarURL())
                    .setColor(0x003399)
                    .setFooter(`Via: Forum Götterfunken | https://discord.gg/M2MnDyU`)
                    .setDescription(message.content);

				const messageAttachment = message.attachments.size > 0 ? message.attachments.first().url : null;
				if(messageAttachment) embed.setImage(messageAttachment);

				let routedMessage:MessageOptions = {};
                if(message.content.startsWith("https://")) routedMessage.content = message.content;

				routedMessage.embeds = [embed];

				routing = routing.filter(route=>route.isActive > 0);
                Tools.asyncForEach(routing, async (route:Eurobot.Route)=>{
					const channel = discord.Client.channels.cache.get(route.to);
					if(channel) await (channel as TextChannel).send(routedMessage);
                });

            }

        }

		// Tweeting
		if(message.content.startsWith("https://")) {

			const authorized = await discord.authorize(message,["Admin","Mod","Twitter"]);
			if(authorized && authorized.length < 1) return;

			const tweetChannels = discord.Config.Channels.filter(channel=>channel.category === "Twitter" && channel.channel_id === message.channel.id);
			if(tweetChannels.length > 0) {

				const ModelTwitter = new TwitterModel();

				const post = await ModelTwitter.post(message)
					.catch(e=>{console.log(e)});

				if(post) {

					console.log("💙 Tweeted "+message.content);
	
				}

			}

		}

		// Brain
		if(message.mentions.has(discord.Client.user) || message.content.toLowerCase().includes(discord.Client.user.username.toLowerCase())) {
			
			const model = new DiscordModel();

			// for random across multiple servers
			// const emoji = Discord.Client.guilds.cache.random().emojis.cache.random();

			// for random from this server
			const emoji = message.guild.emojis.cache.random();

			// TODO
			// if(["are you", "is"])

			if(Math.random() < 0.66) {

				// respond
				const comment = await model.comment(message,{emoji:emoji})

				// reply type
				if(!message.channel) {
					await message.reply(comment);
					return;
				}

				if(Math.random() < 0.66) {
					await message.reply(comment);
				} else {
					await message.channel.send(comment);
				}

			} else {

				// react with emoji
				await message.react(emoji);

			}

			return;
			
		}

		// EU flag React [loveEU]
		if(message.content.toLowerCase().includes("🇪🇺")) {

			const emoji = message.guild.emojis.cache.random();
			message.react(emoji);

			return;

		}

		// keyword react
		if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("sassoli") || message.content.toLowerCase().includes("michel")) {

			const emoji = message.guild.emojis.cache.random();
			message.react(emoji);

			return;

		}

		// FREUDE React
		if(message.content.toLowerCase().match(/freude[!?]*$/gm)) {

			const emoji = message.guild.emojis.cache.random();
			await message.channel.send(`SCHÖNER ${emoji}`);

			return;

		}

		// GOTTERFUNKEN React
		if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

			const emoji = message.guild.emojis.cache.random();
			await message.channel.send(`${emoji}`);

			return;

		}

		return;

	},

};