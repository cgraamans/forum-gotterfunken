import { Message } from "discord.js";
import Discord from "../services/discord";

module.exports = {
	name: 'messageCreate',
	async execute(message:Message) {

		if(message.author.bot) return;
		if(message.mentions.has(Discord.Client.user) || message.content.includes(Discord.Client.user.username)) {
			message.reply({content:`huh :thinking:`});
		}

		console.log(message);

		if(Discord.Authorized(message,["Admin"])) console.log("MSG from Admin");
		if(Discord.Authorized(message,["Mod"])) console.log("MSG from Admin");
		if(Discord.Authorized(message,["Twitter"])) console.log("MSG from Admin");

		// if(Discord.isAuthorized(message.author.id,message.guild,["Twitter"])) message.reply("AUTHORIZED");

		// if(message.channel.id === "609511947762925597" && message.content.startsWith("https://")) {


			// const ModelTwitter = new ModelTwitterObj();
			// const post = await ModelTwitter.post(message)
			// 	.catch(e=>{console.log(e)});
			
			// if(post) {

			// 	console.log("💙 Tweeted "+message.content);

			// }

		// }

		// console.log(`MESSAGE`,message);
	},
};