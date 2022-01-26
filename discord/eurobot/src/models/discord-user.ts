import {DiscordService} from "../services/discord";
import Discord from "discord.js";
import * as Types from "../types/index.d"

export class DiscordModelUser {

    private Member:Discord.GuildMember;

    private UserRoles:string[] = [];
    
    private UserLevel:number = 0;

    constructor(message:Discord.Message,user?:Discord.User|Discord.PartialUser) {
        
        if(message.member) this.Member = message.member;

        if(user) {

            this.Member = message.guild.members.cache.find(member=> member.id === user.id);
    
        }

        DiscordService.Config.Roles.Users.forEach(userRole=>{

            if(this.Member && this.Member.roles.cache.find(r=>r.id === userRole.role_id)) {

                this.UserRoles.push(userRole.category);
                if(userRole.user_level > this.UserLevel) this.UserLevel = userRole.user_level;

            }

        });

    }

    public authorize(role:string) {

        if(this.UserRoles.includes(role)) return true;

        return false;

    }

    public async toggleRoleCountry(keyword:string) {

        if(!this.Member) return;

        let RoleObj:Types.Eurobot.ConfigRolesCountry;
        DiscordService.Config.Roles.Countries.forEach(country=>{

            if(country.alias.includes(keyword) || country.alias.includes(keyword.toLowerCase())) {

                const toToggle = this.Member.guild.roles.cache.find(guildRole=>guildRole.id === country.role_id);
                if(toToggle) {
                    country.toggle_role = toToggle;
                    RoleObj = country;
                }

            }

        });

        if(RoleObj && RoleObj.toggle_role) {

            if(!this.Member.roles.cache.find(role=>role.id === RoleObj.toggle_role.id)) {
                await this.Member.roles.add(RoleObj.toggle_role);
                RoleObj.toggle_result = 1;
            } else {
                await this.Member.roles.remove(RoleObj.toggle_role);
                RoleObj.toggle_result = -1;
            }

            return RoleObj;

        }

    }

    public toRichRoleCountry(item:Types.Eurobot.ConfigRolesCountry) {

        if(!item.toggle_result || !item.toggle_role) return;

        const adremString = item.toggle_result > 0 ? "added to" : "removed from";
        const embed = new Discord.MessageEmbed();

            embed.setColor(0xFFCC00)
                .setDescription(`${item.emoji} ${item.toggle_role.name} ${adremString} ${this.Member}`)
                .setFooter(`-- Eurobot`);

        return embed

    }

}