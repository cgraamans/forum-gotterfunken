import ConfDiscord from "../conf/discord.json";
import Discord, { Guild } from "discord.js";

import {db} from "../services/db";
import {DiscordModelMessage} from "./discord-message"; 

import {TwitterService} from "../services/twitter";
import {Tools} from '../lib/tools';

import * as Types from "../types/index.d"

export class DiscordModelUser {

    private Member:Discord.GuildMember;

    private UserRoles:string[] = [];

    constructor(message:Discord.Message,user?:Discord.User) {

        if(user) {

            this.Member = message.guild.members.cache.find(member=> member.id === user.id);
    
        } else {

            this.Member = message.member;

        }

        for(let role in ConfDiscord.Roles.User) {

            (ConfDiscord.Roles.User as any)[role].forEach((id:string)=>{

                if(this.Member.roles.cache.find(r=>r.id === id) && !this.UserRoles.includes(role)) this.UserRoles.push(role);

            });

        }

    }

    public authorize(role:string) {

        if(this.UserRoles.includes(role)) return true;

        return false;

    }

}