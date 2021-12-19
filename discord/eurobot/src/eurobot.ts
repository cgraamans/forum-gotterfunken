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

import Roll from "roll";
import * as schedule from "node-schedule";

let jobs = [];

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

            // TODO
            // REMOVE HARDCODED IDs
            if(message.channel.id === "609511947762925597" && message.content.startsWith("https://")) {

                if(!User.authorize("Twitter") && !User.authorize("Admin") && !User.authorize("Mod")) return;
    
                const ModelTwitter = new ModelTwitterObj();
                const post = await ModelTwitter.post(message)
                    .catch(e=>{console.log(e)});
                
                if(post) {

                    console.log("💙 Tweeted "+message.content);

                }

            }

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

                    const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                    
                    const discordMessage = Tools.shuffleArray([reaction,emoji]).join(" ");
                    await message.channel.send(discordMessage);

                }

                return;

            }

            // EU flag React [loveEU]
            if(message.content.toLowerCase().includes("🇪🇺")) {

                const emoji = await ModelMessage.MessageGuildEmoji(message,"loveEU").catch(e=>{throw e});
                message.react(emoji.id);

                return;

            }

            // keyword react
            if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("sassoli") || message.content.toLowerCase().includes("michel")) {

                const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                message.react(emoji.id);

                return;

            }

            // FREUDE React
            if(message.content.toLowerCase().match(/freude[!?]*$/gm)) {

                const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                await message.channel.send(`SCHÖNER ${emoji}`);

                return;

            }

            // GOTTERFUNKEN React
            if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

                const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
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

                const RoleObj = await User.toggleRoleCountry(command.options.join(' '));
                if(RoleObj) {

                    const richEmbed = User.toRichRoleCountry(RoleObj);
                    if(richEmbed) await message.channel.send(richEmbed);

                    // Auto Register for FG
                    //TODO REMOVE HARDCODED ID
                    const hasRegisterRole = message.member.roles.cache.find(role=>role.id === "581605959990771725");
                    if(!hasRegisterRole) {

                        const registerRole = message.guild.roles.cache.find(role=>role.id === "581605959990771725");
                        await message.member.roles.add(registerRole);

                        const targetChannel = message.guild.channels.cache.get("257838262943481857") as Discord.TextChannel;
                        if(targetChannel) {

                            const emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{console.log(e)});
                            await targetChannel.send(`${RoleObj.emoji} Welcome to Forum Götterfunken, ${message.author} ${emoji}`).catch(e=>{console.log(e)});

                        }

                    }

                }

                return;

            }

            // REGISTER command
            if(command.string === "register") {

                //TODO REMOVE HARDCODED ID
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

            if(command.string === "subscribe" || command.string === "sub") {

                const channels = ModelMessage.CommandGetOptionsChannels(command.options);
                if(channels.length > 0) {
                    
                    const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
                    const channelName = channels[0].replace(regex,"");

                    const role = message.guild.roles.cache.find(r=>r.name === channelName);
                    if(!role || DiscordService.Config.Roles.Users.find(UserRole=>UserRole.role_id === role.id) || DiscordService.Config.Roles.Countries.find(CountriesRole=>CountriesRole.role_id === role.id)) return;

                    message.member.roles.add(role);

                }

            }

            if(command.string === "unsubscribe" || command.string === "unsub") {

            }

            // Add topic
            if(command.string === "addtopic") {

                if(!User.authorize("TopicModerator") && !User.authorize("Admin") && !User.authorize("Mod")) return;
                if(command.options.length < 1) return;

                const channels = ModelMessage.CommandGetOptionsChannels(command.options);
                if(channels.length < 1) return;

                if(!message.guild.channels.cache.find(ch=>ch.id === channels[0])) return;

                const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
                const channelName = command.options[0].replace(regex,"");
                        
                if(!channelName || message.guild.roles.cache.find((r) => r.name === channelName)) return;
                        
                await message.guild.roles.create({
                    data: {
                    name: channelName,
                    color: 'WHITE',
                    mentionable: true
                    },
                    reason: `New channel topic role: ${channelName}`,

                })
                .catch(console.error);

                return;

            }

            // Dice roll
            if(command.string === "roll") {

                if(!User.authorize("Admin") && !User.authorize("Mod") && !User.authorize("Dice")) return;
                
                const roll = new Roll();
                if(roll.validate(command.options[0])) {

                    const rollResult = roll.roll(command.options[0]).result;

                    let emoji;
                    let text = `${rollResult}`;
                    if(command.options.length > 1) {
                        
                        emoji = await ModelMessage.MessageGuildEmoji(message).catch(e=>{throw e});
                        if(Math.random() < 0.5){
                            text = `${emoji} ` + text;
                        } else {
                            text = text + ` ${emoji}`;
                        }

                    }
                    message.channel.send(text);
                    
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

                // Remove user's reaction
                // ModelPoll.PromiseEmojiList.push(reaction.message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user.id));

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

            // TODO: if commandline has output on
            // if(post) {
            //     console.log("💙 Tweeted");
            // }

        }

        return;

    });

    //
    // JOBS
    // TODO: Move jobs to DiscordService Controller

    // TODO: Job-News
    jobs.push({

        id:"Job-News",
        job:schedule.scheduleJob("0 0 0 * * *", async ()=>{

            // get news
            return;

        })

    });

    jobs.push({

        id:"Job-Calendar",
        job:schedule.scheduleJob("0 0 7 * * *", async ()=>{

            if(DiscordService.client) {

                const ModelCalendar = new ModelCalendarObj();

                const range = ModelCalendar.CalendarTextToUnixTimes();
                if(!range) return;

                const items = await ModelCalendar.get(range);
                if(items.length > 0) {

                    const embed = ModelCalendar.toRich(items,range);

                    DiscordService.client.guilds.cache.forEach(guild=>{

                        let channelRows = DiscordService.Config.Channels.filter(x=>x.category === "Job-Calendar");
                        channelRows.forEach(channelRow=>{

                            let channel = guild.channels.cache.get(channelRow.channel_id) as Discord.TextChannel;
                            if(channel && embed) channel.send(embed);  

                        });

                    });

                } else {

                    console.log("- no calendar items for "+ range.from + "-" + range.to);

                }

            }

            return;            

        })

    });

    return;

};

run().catch(e=>{console.log(e);});