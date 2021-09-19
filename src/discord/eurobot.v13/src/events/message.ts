import { Message } from "discord.js";
import Discord from "../services/discord";
import {MessageEmbed, TextChannel, MessageOptions} from "discord.js";
import TwitterModel from "../models/twitter";
import Tools from "../lib/tools";
import * as Types from "../../types/index.d"

module.exports = {

	name: 'messageCreate',
	async execute(message:Message) {

		if(message.author.bot) return;
		if(message.mentions.has(Discord.Client.user) || message.content.includes(Discord.Client.user.username)) {
			message.reply({content:`huh :thinking:`});
		}

		// Routing
        if(message.channel && Discord.Config.Routes) {

            let routing = Discord.Config.Routes.filter(route=>route.from === message.channel.id)
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
                Tools.asyncForEach(routing, async (route:Types.Base.ChannelRoute)=>{
					const channel = Discord.Client.channels.cache.get(route.to);
					if(channel) await (channel as TextChannel).send(routedMessage);
                });

            }

        }

		if(message.content.startsWith("https://")) {

			const authorized = await Discord.authorize(message,["Admin","Mod","Twitter"]);
			if(authorized && authorized.length < 1) return;

			const tweetChannels = Discord.Config.Channels.filter(channel=>channel.category === "Twitter" && channel.channel_id === message.channel.id);
			if(tweetChannels.length > 0) {

				const ModelTwitter = new TwitterModel();

				const post = await ModelTwitter.post(message)
					.catch(e=>{console.log(e)});

				if(post) {

					console.log("💙 Tweeted "+message.content);
	
				}

			}

		}

	},

};