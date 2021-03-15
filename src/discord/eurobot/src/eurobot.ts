import ConfDiscord from "./conf/discord.json";
import Discord from "discord.js";
import {DiscordMessageModel as DiscordMessageModelObj} from "./models/discord-message";
import {DiscordService} from "./services/discord";
import {Tools} from "./lib/tools";

const run = async ()=>{

    console.log(`START: ${new Date()}`);

    DiscordService.client.on("message",async (message:Discord.Message)=>{
        
        if(message.member.user.bot) return;

        const DiscordMessageModel = new DiscordMessageModelObj(message);
        if(message.channel) {

            // Blacklisted Words and Phrases
            if(DiscordMessageModel.BannedPhrases(message.content)) {

                await DiscordService.UserWarningAdd(message.author,'Banned Words');

                const userWarnings = await DiscordService.UserWarnings(message.author);
                let warnings = ConfDiscord.maxUserWarnings - (userWarnings.length + 1);

                if(warnings < 1) {
                
                    let embedMsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`🔨 ${message.author.username} Banned`)
                        .setDescription(`Tag: ${message.author.tag}\nWarnings Exceeded`);

                    await message.channel.send(embedMsg);
                    await message.member.ban({reason:'Warnings Exceeded: Banned words.'});

                } else {
                    
                    let embedMsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`🛑 Warning for ${message.author.username}: Banned Word`)
                        .setDescription(`You, ${message.author}, have been warned for using a banned word or phrase on this server.\n\nPlease refer to the #rules or ask a Senator for help.`)
                        .setFooter(`${warnings} ${Tools.stringMultiplicity(warnings,"warning")} left until 🔨 ban.`);
                    
                    await message.channel.send(embedMsg);

                }

                message.delete();
                return;

            }

            // Bot Mentions and Bot Username Mentions
            if(message.mentions.has(DiscordService.client.user) || message.content.toLowerCase().includes(DiscordService.client.user.username.toLowerCase())) {

                if(Math.round(Math.random()) < 1) {

                    let emoji = await DiscordMessageModel.MessageGuildEmoji(message).catch(e=>{throw e});
                    await message.react(emoji.id);

                } else {

                    let reaction = await DiscordMessageModel.React(message).catch(e=>{throw e});
                    let emoji = await DiscordMessageModel.MessageGuildEmoji(message).catch(e=>{throw e});
                    
                    let discordMessage = Tools.shuffleArray([reaction,emoji]).join(" ");
                    await message.channel.send(discordMessage);

                }

                return;

            }

            // EU Flag React [loveEU]
            if(message.content.toLowerCase().includes("🇪🇺")) {

                let emoji = await DiscordMessageModel.MessageGuildEmoji(message,"starryeyes").catch(e=>{throw e});
                message.react('🇪🇺');

                return;

            }

            // FREUDE React
            if(message.content.toLowerCase().endsWith("freude")) {

                let emoji = await DiscordMessageModel.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`SCHÖNER ${emoji}`);

                return;

            }

            // GOTTERFUNKEN React
            if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

                let emoji = await DiscordMessageModel.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`${emoji}`);

                return;

            }

            // Commands
            await DiscordMessageModel.Commands(message);

        }

        return;

    });

    DiscordService.client.on("messageReactionAdd",async (reaction:Discord.MessageReaction)=>{

        if(reaction.message.member.user.bot) return;

        // Fetch reaction message if not cached
        if (reaction.message.partial) await reaction.message.fetch();

        // Has bot action footer
        if((reaction.message.embeds.length > 0) && reaction.message.embeds[0].footer && reaction.message.embeds[0].footer.text.endsWith(reaction.message.id)) {



        }


    });

    DiscordService.client.on("messageReactionRemove",async (reaction:Discord.MessageReaction)=>{

        if(reaction.message.member.user.bot) return;

        // Fetch reaction message if not cached
        if (reaction.message.partial) await reaction.message.fetch();

        // Has bot action footer
        if((reaction.message.embeds.length > 0) && reaction.message.embeds[0].footer && reaction.message.embeds[0].footer.text.endsWith(reaction.message.id)) {



        }

    });

    DiscordService.client.on("guildMemberAdd",async (member:Discord.GuildMember)=> {

    });

    return;

};

// console.log(options);
run().catch(e=>{console.log(e);});