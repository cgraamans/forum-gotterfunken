import { Message } from "discord.js";
import Discord from "../services/discord";

module.exports = {
	name: 'message',
	once: false,
	async execute(message:Message) {

		if(message.author.bot) return;

		if(!Discord.isAuthorized(message.author.id,message.guild,["Twitter","Admin","Mod"])) message.reply("AUTHORIZED");

		// if(message.channel.id === "609511947762925597" && message.content.startsWith("https://")) {


			// const ModelTwitter = new ModelTwitterObj();
			// const post = await ModelTwitter.post(message)
			// 	.catch(e=>{console.log(e)});
			
			// if(post) {

			// 	console.log("💙 Tweeted "+message.content);

			// }

		// }

		console.log(`MESSAGE`,message);
	},
};