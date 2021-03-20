import ConfDiscord from "../conf/discord.json";
import Discord from "discord.js";
import {DiscordModelMessage} from "./discord-message";
import {Tools} from "../lib/tools";
import * as Types from "../types/index.d";
import { db } from "../services/db";

export class DiscordModelPoll {


    constructor() {


    }

    private CommandOptionsFilter(options:string[]) {

        options = options.filter(option=>{
            return !Tools.stringDateSMHDToTime(option);
        })

        options = options.filter(option=>{
            return !option.match(Discord.MessageMentions.CHANNELS_PATTERN) || !option.startsWith("/");
        });

        return options;

    }

    private getConfChannel(message:Discord.Message) {

        let Channel:Discord.GuildChannel;

        ConfDiscord.Channels.Poll.forEach(pollChannel=>{
            const pollGuildChannel = message.guild.channels.cache.find(guildChannel=>guildChannel.id === pollChannel);
            if(pollGuildChannel) Channel = pollGuildChannel;
        });

        return Channel;

    }

    get() {

        // fetchedMessages.find(m => (m.embeds.length > 0) && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(emoji) && m.embeds[0].footer.text.endsWith(message.id));

    }

    update(message:Discord.Message) {



    }

    // Post new poll
    // POST
    async post(command:Types.DiscordModelMessage.CommandModel,message:Discord.Message) {
 
        if(command.options.length > 0) {

            // SET CHECK for database implementation in the future
            if(command.options[0] !== "set") {

                const ModelMessage = new DiscordModelMessage(message)

                // Filter
                const filteredOptions = this.CommandOptionsFilter(command.options);
                if(filteredOptions.length < 1 || !filteredOptions[command.options.length-1].endsWith("?")) {
                    // polls must have some content
                    message.channel.send(`Polls must have a question and end in a \`?\``);
                    return;
                }

                // Set channel for output
                let Channel = this.getConfChannel(message);
                if(Channel) {
                    const guildChannel = message.guild.channels.cache.find(x=>x.id === Channel.id);
                    if(guildChannel) Channel = guildChannel;
                }

                let ChannelOverwrite = ModelMessage.CommandGetOptionsChannels(command.options);
                if(ChannelOverwrite.length > 0) {
                    const guildChannel = message.guild.channels.cache.find(x=>x.id === ChannelOverwrite[0]);
                    if(guildChannel) Channel = guildChannel;
                }

                if(!Channel) {
                    message.channel.send(`Cannot find default or specified channel`);
                    return;
                }

                // set poll in db
                let poll:Types.DiscordModelPoll.Poll = {

                    author:message.author.id,                    
                    channel:Channel.id,
                    end:(new Date().getTime()+86400000),
                    start:(new Date().getTime()),
                    text:filteredOptions.join(" "),

                };
    
                const timeOptions = ModelMessage.CommandGetOptionsTime(command.options);
                if(timeOptions.length > 0) {
                    poll.end = (Math.round((new Date().getTime()+timeOptions[timeOptions.length-1])/1000));
                }

                let post = this.toRich(message,poll);
                const channel = message.client.channels.cache.find(channel => channel.id === poll.channel)
                if(post && channel && channel.type === "text" && !ConfDiscord.Channels.Ignore.includes(channel.id)){
                    
                    let sentMessage = await (channel as Discord.TextChannel).send(post);
                    poll.message = sentMessage.id;
                
                    const res = await db.q(`
                        INSERT INTO discord_polls SET ?
                    `,[poll]);

                    await sentMessage.react("👍");
                    await sentMessage.react("👎");
                    await sentMessage.react("🤷");
                
                }

            }

        }

        return;

    } // POST

    // Convert poll to rich output
    // toRich
    public toRich(message:Discord.Message,poll:Types.DiscordModelPoll.Poll) {

        const ModelMessage = new DiscordModelMessage(message)

        const embed = new Discord.MessageEmbed()
            .setTitle(`🇪🇺 Eurobot Poll`)
			.setColor(0xFFCC00)
			.setAuthor(message.author.tag, message.author.avatarURL())
            .setTimestamp(new Date())
			.setFooter(`👍 ${poll.results ? poll.results.up.length : 0} 👎 ${poll.results ? poll.results.down.length : 0} 🤷 ${poll.results ? poll.results.shrug.length : 0} | Ends: ${Tools.dateTimeToHHss((new Date(poll.end)))}| ${message.id}`)
			.setURL(message.url)
            .setDescription(poll.text)

            if(message.attachments.array().length > 0 && ModelMessage.isImage(message.attachments.array()[0].url)) {
                const image = message.attachments.array()[0].url;
                embed.setImage(image);
            }
    

        return embed;



    } // toRich




}