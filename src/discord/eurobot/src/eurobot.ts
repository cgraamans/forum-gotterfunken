import ConfDiscord from "./conf/discord.json";
import Discord from "discord.js";
import {DiscordModelCalendar as ModelCalendarObj} from "./models/discord-calendar";
import {DiscordModelMessage as ModelMessageObj} from "./models/discord-message";
import {DiscordModelPoll as ModelPollObj} from "./models/discord-poll";
import {DiscordModelNews as ModelNewsObj} from "./models/discord-news";

import {DiscordService} from "./services/discord";

import {Tools} from "./lib/tools";

const run = async ()=>{

    console.log(`START: ${new Date()}`);

    DiscordService.client.on("message",async (message:Discord.Message)=>{
        
        if(message.member.user.bot) return;

        const ModelMessage = new ModelMessageObj(message);
        if(message.channel) {

            // BLACKLIST
            // Blacklisted Words and Phrases
            if(ModelMessage.BannedPhrases(message.content)) {

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

            } // BLACKLIST

            // BOT REACT
            // Bot Mentions and Bot Username Mentions
            if(message.mentions.has(DiscordService.client.user) || message.content.toLowerCase().includes(DiscordService.client.user.username.toLowerCase())) {

                if(Math.round(Math.random()) < 1) {

                    let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                    await message.react(emoji.id);

                } else {

                    if(ConfDiscord.Channels.Ignore.includes(message.channel.id)) return;

                    let reaction = await ModelMessage.React(message).catch(e=>{throw e});
                    let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                    
                    let discordMessage = Tools.shuffleArray([reaction,emoji]).join(" ");
                    await message.channel.send(discordMessage);

                }

                return;

            } // BOT REACT

            // EU Flag React [loveEU]
            if(message.content.toLowerCase().includes("🇪🇺")) {

                if(ConfDiscord.Channels.Ignore.includes(message.channel.id)) return;

                let emoji = await ModelMessage.MessageGuildEmoji(message,"loveEU").catch(e=>{throw e});
                message.react(emoji.id);

                return;

            } // EU Flag React

            // keyword react [loveEU]
            if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("sassoli")) {

                if(ConfDiscord.Channels.Ignore.includes(message.channel.id)) return;

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                message.react(emoji.id);

                return;

            } // EU Flag React

            // FREUDE React
            if(message.content.toLowerCase().endsWith("freude")) {

                if(ConfDiscord.Channels.Ignore.includes(message.channel.id)) return;

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`SCHÖNER ${emoji}`);

                return;

            } // FREUDE React

            // GOTTERFUNKEN React
            if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

                if(ConfDiscord.Channels.Ignore.includes(message.channel.id)) return;

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`${emoji}`);

                return;

            }

            // Extract Commands
            const command = ModelMessage.GetCommand(message);
            if(!command) return;

            // CALENDAR COMMAND            
            if(command.string === "calendar") {

                const ModelCalendar = new ModelCalendarObj();

                const range = ModelCalendar.CalendarTextToUnixTimes(message.content);
                if(!range) return;

                const items = await ModelCalendar.get(range);
                if(items.length > 0) {

                    const embed = ModelCalendar.toRich(items,range);
                    if(embed) await message.channel.send(embed);    

                }

                return;

            }

            // MUTE command
            if(command.string === "mute") {

                if(!ModelMessage.UserRoles.includes("Admin") && !ModelMessage.UserRoles.includes("Mod")) return;

                if(message.mentions && message.mentions.members) {

                    let futureTimeTimeout:number = Tools.stringDateSMHDToTime(message.content.toLowerCase());
                    if(!futureTimeTimeout) futureTimeTimeout = 120000;

                    const mute = message.guild.roles.cache.find(role=>role.name.toLowerCase() === "mute");
                    message.mentions.members.forEach(mentionedMember=>{

                        mentionedMember.roles.add(mute);

                        DiscordService.Timers.push(setTimeout(()=>{

                            if(message.member.roles.cache.find(memberRole=>memberRole.id === mute.id)) {

                                mentionedMember.roles.remove(mute);

                            }

                        },futureTimeTimeout));

                    });

                }

            }

            // UNMUTE command
            if(command.string === "unmute") {

                if(!ModelMessage.UserRoles.includes("Admin") && !ModelMessage.UserRoles.includes("Mod")) return;

                const mute = message.guild.roles.cache.find(role=>role.name.toLowerCase() === "mute");

                message.mentions.members.forEach(mentionedMember=>{

                    if(mentionedMember.roles.cache.find(memberRole=>memberRole.id === mute.id)) {

                        mentionedMember.roles.remove(mute);

                    }

                });

            }

            // NEWS command
            if(command.string === "news") {

                const ModelNews = new ModelNewsObj();
                let news = await ModelNews.get();

                if(news) {

                    const embed = ModelNews.toRich(news);
                    if(embed) await message.channel.send(embed);

                }

                return;

            }

            // POLL command

            if(command.string === "poll") {

                if(!ModelMessage.UserRoles.includes("Admin") && !ModelMessage.UserRoles.includes("Mod")) return;

                const ModelPoll = new ModelPollObj();
                const post = await ModelPoll.post(command,message);

                // if(poll) {

                //     const embedObj = ModelPoll.toRich(poll);
                //     // if(embed)

                // }

            }

        }

        return;

    });

    DiscordService.client.on("messageReactionAdd",async (reaction:Discord.MessageReaction, user:Discord.User|Discord.PartialUser)=>{

        if(user.bot) return;

        // Fetch reaction message if not cached
        if (reaction.message.partial) await reaction.message.fetch();

        // Has bot action footer
        if((reaction.message.embeds.length > 0) && reaction.message.embeds[0].footer && reaction.message.embeds[0].footer.text.endsWith(reaction.message.id)) {

            const ModelPoll = new ModelPollObj();
            const update = ModelPoll.update(reaction.message);
            // if(update) {
            //     reaction.message
            //     // richMsg

            // }
        }


    });

    DiscordService.client.on("messageReactionRemove",async (reaction:Discord.MessageReaction)=>{

        if(reaction.message.member.user.bot) return;

        // Fetch reaction message if not cached
        if (reaction.message.partial) await reaction.message.fetch();

        // Has bot action footer
        if((reaction.message.embeds.length > 0) && reaction.message.embeds[0].footer && reaction.message.embeds[0].footer.text.endsWith(reaction.message.id)) {

            const ModelPoll = new ModelPollObj();
            const update = ModelPoll.update(reaction.message);
            // if(update) {
            //     reaction.message
            //     // richMsg

            // }

        }

    });

    DiscordService.client.on("guildMemberAdd",async (member:Discord.GuildMember)=> {

    });

    return;

};

// console.log(options);
run().catch(e=>{console.log(e);});