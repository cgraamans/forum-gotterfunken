import ConfDiscord from "./conf/discord.json";
import Discord from "discord.js";

import {DiscordModelCalendar as ModelCalendarObj} from "./models/discord-calendar";
import {DiscordModelMessage as ModelMessageObj} from "./models/discord-message";
import {DiscordModelPoll as ModelPollObj} from "./models/discord-poll";
import {DiscordModelNews as ModelNewsObj} from "./models/discord-news";
import {DiscordModelTwitter as ModelTwitterObj} from "./models/discord-twitter";
import {DiscordModelUser as ModelUserObj} from "./models/discord-user";

import {DiscordService} from "./services/discord";
import {Tools} from "./lib/tools";

const run = async ()=>{

    console.log(`START: ${new Date()}`);

    DiscordService.client.on("message",async (message:Discord.Message)=>{

        const User = new ModelUserObj(message);

        const ModelMessage = new ModelMessageObj(message);
        if(message.channel) {

            //
            // PRE-PROCESSING
            //

            const routed = ModelMessage.Route(message);
            if(routed) return;

            if(!message.member) return;

            if(message.member.user && message.member.user.bot) return;

            if(DiscordService.Config.Channels.find(ch=>ch.category.toLowerCase() === "ignore" && ch.channel_id === message.channel.id)) return;

            // Bad words and phrases
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

            }

            //
            // REACTIONS
            //

            // Bot Mentions and Bot Username Mentions
            if(message.mentions.has(DiscordService.client.user) || message.content.toLowerCase().includes(DiscordService.client.user.username.toLowerCase())) {

                if(Math.random() < 0.4) {

                    let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                    await message.react(emoji.id);

                } else {

                    let reaction:string;

                    if(Math.random() > 0.8) {
                        let reactionObj = await ModelMessage.React(message).catch(e=>{throw e});
                        reaction = reactionObj.reaction;
                    }

                    let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                    
                    let discordMessage = Tools.shuffleArray([reaction,emoji]).join(" ");
                    await message.channel.send(discordMessage);

                }

                return;

            }

            // EU flag React [loveEU]
            if(message.content.toLowerCase().includes("🇪🇺")) {

                let emoji = await ModelMessage.MessageGuildEmoji(message,"loveEU").catch(e=>{throw e});
                message.react(emoji.id);

                return;

            }

            // keyword react
            if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("sassoli") || message.content.toLowerCase().includes("michel")) {

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                message.react(emoji.id);

                return;

            }

            // FREUDE React
            if(message.content.toLowerCase().match(/freude[!?]*$/gm)) {

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`SCHÖNER ${emoji}`);

                return;

            }

            // GOTTERFUNKEN React
            if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

                let emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`${emoji}`);

                return;

            }

            //
            // COMMANDS
            //
            
            // Extract commands from message
            const command = ModelMessage.GetCommand(message);
            if(!command) return;

            // CALENDAR command            
            if(command.string === "calendar") {

                if(!User.authorize("Calendar") && !User.authorize("Admin") && !User.authorize("Mod")) return;

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

                if(!User.authorize("Admin") && !User.authorize("Mod")) return;

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

                if(!User.authorize("Admin") && !User.authorize("Mod")) return;

                const mute = message.guild.roles.cache.find(role=>role.name.toLowerCase() === "mute");

                message.mentions.members.forEach(mentionedMember=>{

                    if(mentionedMember.roles.cache.find(memberRole=>memberRole.id === mute.id)) {

                        mentionedMember.roles.remove(mute);

                    }

                });

            }

            // NEWS command
            if(command.string === "news") {

                if(!User.authorize("News") && !User.authorize("Admin") && !User.authorize("Mod")) return;

                const ModelNews = new ModelNewsObj();
                let news = await ModelNews.get(command,message);

                if(news) {

                    const embed = ModelNews.toRich(news);
                    if(embed) await message.channel.send(embed);

                }

                return;

            }

            // POLL command
            if(command.string === "poll") {

                if(!User.authorize("Poll") && !User.authorize("Admin") && !User.authorize("Mod")) return;

                const ModelPoll = new ModelPollObj();
                await ModelPoll.post(command,message);

                return;

            }

            // COUNTRY command
            if(command.string === "country") {

                if(!User.authorize("Country") && !User.authorize("Admin") && !User.authorize("Mod")) return;

                const RoleObj = await User.toggleRoleCountry(command.options.join(' '));
                if(RoleObj) {

                    const richEmbed = User.toRichRoleCountry(RoleObj);
                    if(richEmbed) message.channel.send(richEmbed);

                }

                // Auto Register for FG
                const registerRole = message.member.roles.cache.find(role=>role.id === "581605959990771725");
                if(registerRole) await message.member.roles.add(registerRole);

                return;

            }

            // REGISTER command
            if(command.string === "register") {

                //TODO REMOVE HARDCODED ID
                //TODO RICH EMBED TO CHANNEL
                const registerRole = message.guild.roles.cache.find(role=>role.id === "581605959990771725");
                if(registerRole && !message.member.roles.cache.find(r=>r.id === registerRole.id)) {

                    await message.member.roles.add(registerRole);
                    const targetChannel = message.guild.channels.cache.get("257838262943481857") as Discord.TextChannel;
                    if(targetChannel) {

                        const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{console.log(e)});
                        await targetChannel.send(`Welcome to Forum Götterfunken, ${message.author} ${emoji}`).catch(e=>{console.log(e)});

                    }

                }
                return;

            }

        }

        return;

    });

    DiscordService.client.on("messageReactionAdd",async (reaction, user)=>{

        if(user.bot) return;

        // Fetch reaction message if not cached
        if (reaction.message.partial) reaction.message = await reaction.message.fetch();

        if(user.partial) user = await user.fetch();

        // Has bot action footer
        if(reaction.message.embeds && reaction.message.embeds.length > 0 && reaction.message.embeds[0].footer && reaction.message.embeds[0].footer.text.endsWith("Poll "+reaction.message.id) && ["👍","👎","🤷"].includes(reaction.emoji.name)) {

            const ModelPoll = new ModelPollObj();
            const update = await ModelPoll.update(reaction,user);
            if(update) {

                ModelPoll.PromiseEmojiList.push(reaction.message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user.id));

                const poll = await ModelPoll.get(reaction.message);
                const totals = await ModelPoll.getResultTotals(reaction.message);

                await reaction.message.edit(ModelPoll.toRich(reaction.message,poll,totals));

            }
            
        }

        if(["💙"].includes(reaction.emoji.name)) {

            const User = new ModelUserObj(reaction.message,user);

            if(!User.authorize("Twitter") && !User.authorize("Admin") && !User.authorize("Mod")) return;

            const ModelTwitter = new ModelTwitterObj();
            const post = await ModelTwitter.post(reaction.message,user)
                .catch(e=>{console.log(e)});
            
            if(post) {
                console.log("💙 Tweeted");
            }

        }

        return;

    });

    DiscordService.client.on("guildMemberAdd",async (member:Discord.GuildMember)=> {

        // const casual = member.guild.channels.cache.find(ch=>ch.id === "");
        // if(casual) 
        return;

    });

    return;

};

run().catch(e=>{console.log(e);});