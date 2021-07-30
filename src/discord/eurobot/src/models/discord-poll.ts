import ConfDiscord from "../conf/discord.json";
import Discord from "discord.js";
import {DiscordModelMessage} from "./discord-message";
import {Tools} from "../lib/tools";
import * as Types from "../types/index.d";
import { db } from "../services/db";
import { DiscordService } from "../services/discord";

export class DiscordModelPoll {


    public PromiseEmojiList:Promise<any>[] = [];

    constructor() {


    }

    private getConfChannel(message:Discord.Message) {

        let Channel:Discord.GuildChannel;

        DiscordService.Config.Channels.forEach((ch:Types.Eurobot.ConfigChannel)=>{
            if(ch.category.toLowerCase() === "poll") {
                const channel = message.guild.channels.cache.find(gCh=>gCh.id === ch.channel_id);
                if(channel) Channel = channel;
            }
        });
        
        return Channel;

    }

    async get(message:Discord.Message) {

        let pollArray = await db.q(`SELECT * FROM discord_polls WHERE message = ?`,[message.id])
        if(!pollArray || pollArray.length < 1) return;

        let poll = (pollArray[0] as Types.DiscordModelPoll.Poll);

        // Cast to num
        if(typeof poll.end === 'string') poll.end = parseInt(poll.end);
        if(typeof poll.start === 'string') poll.start = parseInt(poll.start);


        // get User
        const userObj = message.guild.members.cache.find(x=>x.id === poll.author);
        if(userObj) poll.user = userObj.user;

        return poll;

    }

    async getResultTotals(message:Discord.Message) {

        // Result totals
        let ResultTotals:Types.DiscordModelPoll.PollResultTotals = {
            up:0,
            down:0,
            shrug:0
        };

        let pollVoteTotals:Types.DiscordModelPoll.PollResultDBTotal[] = await db.q(`
            SELECT vote, count(*) as num
            FROM discord_poll_votes AS DPV
            WHERE message = ?
            GROUP BY vote ORDER BY num ASC
        `,[message.id]);

        pollVoteTotals.forEach(voteTotal=>{
            for(const i in ResultTotals){

                if(voteTotal.vote === i) (<any>ResultTotals)[i] = voteTotal.num;

            }

        });

        return ResultTotals;

    }

    async update(reaction:Discord.MessageReaction,user:Discord.PartialUser | Discord.User) {

        let VoteDir:string;

        if(reaction.emoji.name === "👎") VoteDir = "down";
        if(reaction.emoji.name === "👍") VoteDir = "up";
        if(reaction.emoji.name === "🤷") VoteDir = "shrug";

        if(VoteDir) {

            await db.q(`
            
                        INSERT INTO discord_poll_votes(message,member,vote,dt)
                        VALUES (?,?,?,?)
                        ON DUPLICATE KEY UPDATE vote = ?, dt = ?;

                    `,[
                        reaction.message.id,
                        user.id,
                        VoteDir,
                        (new Date().getTime()),
                        VoteDir,
                        (new Date().getTime())
                    ]
                )
                .catch(e=>{
                    console.log(e);
                });

        }
        
        return VoteDir;

    }

    // Post new poll
    // POST
    async post(command:Types.DiscordModelMessage.CommandModel,message:Discord.Message) {
 
        if(command.options.length > 0) {

            // SET CHECK for database implementation in the future
            if(command.options[0] !== "set") {

                const ModelMessage = new DiscordModelMessage(message)

                // Filter
                const filteredOptions = ModelMessage.CommandOptionsFilter(command.options);

                if(filteredOptions && (filteredOptions.length < 1 || (filteredOptions.length > 0 && !filteredOptions[filteredOptions.length-1].endsWith("?")))) {
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
                    text:filteredOptions.join(" ")
                };
    
                const timeOptions = ModelMessage.CommandGetOptionsTime(command.options);
                if(timeOptions.length > 0) {
                    poll.end = (Math.round((new Date().getTime()+timeOptions[timeOptions.length-1])/1000));
                }

                // SEND
                const channel = message.client.channels.cache.find(channel => channel.id === poll.channel);
                if(channel && channel.type === "text" && !DiscordService.Config.Channels.find(ch=>ch.category.toLowerCase() === "ignore" && ch.channel_id === channel.id)){

                    let post = this.toRich(message,poll);
                    if(!post) return;
                    
                    let sentMessage = await (channel as Discord.TextChannel).send(post);
                    poll.message = sentMessage.id;

                    sentMessage.edit(this.toRich(message,poll));
                
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
    public toRich(message:Discord.Message,poll:Types.DiscordModelPoll.Poll,ResultTotals?:Types.DiscordModelPoll.PollResultTotals) {

        const ModelMessage = new DiscordModelMessage(message)

        // Poll result totals in percent
        let totalResults:number = 0;
        let pct:Types.DiscordModelPoll.PollResultTotals = {
            shrug:0,
            up:0,
            down:0
        }

        let results:Types.DiscordModelPoll.PollResultTotals = {
            shrug:0,
            up:0,
            down:0
        };
        let user:Discord.User = message.author;

        if(poll.user) user = poll.user;
        if(ResultTotals) results = ResultTotals;

        for(let i in results) {
            totalResults += (<any>results)[i];
        }

        if(totalResults > 0) {

            for(let i in results) {
                (<any>pct)[i] = Tools.toPercent((<any>results)[i],totalResults);
            }                

        }

        // Set % fields
        let fields:Discord.EmbedFieldData[] = [{
                name: "\u200B",
                value: `${results.up} 👍`,
                inline: true
            },
            {
                name: "\u200B",
                value: `${results.down} 👎`,
                inline: true
            },
            {
                name: "\u200B",
                value: `${results.shrug} 🤷`,
                inline: true
            }];
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Poll`)
			.setColor(0xFFCC00)
			.setAuthor(user.tag, user.avatarURL())
			.setFooter(`${pct.up}% 👍 ${pct.down}% 👎 ${pct.shrug}% 🤷 | Ends ${Tools.dateTimeToHHss((new Date(poll.end)))} | Poll ${poll.message}`)
			.setURL(message.url)
            .setDescription(`\n\n${poll.text}\n\n`)
            .addFields(fields);

            if(message.attachments.array().length > 0 && ModelMessage.isImage(message.attachments.array()[0].url)) {
                const image = message.attachments.array()[0].url;
                embed.setImage(image);
            }
    
        return embed;

    } // toRich




}