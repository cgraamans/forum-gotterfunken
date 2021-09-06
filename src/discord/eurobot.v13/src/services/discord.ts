import DB from "./db";
import * as ClientT from "../../types/discord";
import * as BotT from "../../types/index";

import {Intents, Message, User, Client, Guild} from "discord.js";
import * as fs from "fs";

import * as Eurobot from "../../types/index.d";

export class Discord {

    private static instance:Discord;

    public Client:Client

    public Timers:NodeJS.Timeout[] = [];

    public Config:Eurobot.Base.Config = {};

    private Roles:string[] = [];

    // Service Instance Initialization
    static getInstance() {
        
        if (!Discord.instance) {
            Discord.instance = new Discord();
        }
        return Discord.instance;

    }

    constructor() {

        try {

            //
            // CONFIG
            //

            this.Client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});

            this.getConfig().then(()=>{

                const eventFiles = fs.readdirSync(`${__dirname}/../events`).filter(file=>!file.endsWith('.map'));

                for (const file of eventFiles) {
                    const event = require(`${__dirname}/../events/${file}`);
                    if (event.once) {
                        this.Client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        this.Client.on(event.name, (...args) => event.execute(...args));
                    }
                }

            }).catch(e=>{console.log(e)});

                // 
                // DISCORD CLIENT
                //
                // Queue events


                this.Client.on("error",e=>{

                    console.log("Discord Service Client Error");
                    throw e;

                });

                this.Client.on('disconnect',(message:Message)=>{

                    if(message) console.log("Disconnected",message);

                    setTimeout(()=>{
                        this.Client.login(process.env.EUROBOT_DISCORD)
                    },15000);
                
                });
                
                this.Client.login(process.env.EUCOBOT);

        } catch(e) {

            throw e;
        
        }

    }

    // Retrieve configs from database for constructor
    private async getConfig() {

        this.Config.Routes = await DB.q("SELECT * FROM discord_conf_routes").catch(e=>{throw e});
        this.Config.BadWords = await DB.q("SELECT * FROM discord_conf_badwords").catch(e=>{throw e});
        this.Config.Channels = await DB.q("SELECT * FROM discord_conf_channels").catch(e=>{throw e});
        this.Config.Reactions = await DB.q("SELECT * FROM discord_conf_reactions").catch(e=>{throw e});
        this.Config.Roles = {
            Countries:(await DB.q("SELECT * FROM discord_conf_role_countries").catch(e=>{throw e})),
            Users:(await DB.q("SELECT * FROM discord_conf_role_users").catch(e=>{throw e}))
        };

        return;

    }

    // // Get User Warnings
    // public async UserWarnings(user:User,minutes:number = 5):Promise<any> {

    //     return await DB.q(`
        
    //         SELECT * FROM discord_user_warnings 
    //         WHERE user_id = ?
    //         AND dt > ?
        
    //     `,[user.id,(new Date().getTime() - (minutes * 60000))]);
    
    // }

    // public async UserWarningAdd(user:User, reason:string|null = null) {

    //     return await DB.q(`

    //         INSERT INTO discord_user_warnings
    //         SET ?

    //     `,[{
    //         user_id:user.id,
    //         dt:(new Date().getTime()),
    //         reason:reason
    //     }]);

    // }

    // is a user authorized for an action?
    public async isAuthorized(userID:string,guild:Guild,roles:string[]) {

        const user = guild.members.cache.get(userID);
        if(!user) return;

        // if(typeof roles === "string") roles = [roles];
        let RoleCategory:BotT.Base.ConfigRolesUser;
        roles.forEach(role=>{
            // find role name in Config
            const UserRole = this.Config.Roles.Users.find(userRole=>userRole.category === role);
            if(UserRole) RoleCategory = UserRole;
        });
        if(!RoleCategory) return false;

        // todo: refactor role_id to id
        const RoleGuild = guild.roles.cache.find(guildRole=>guildRole.id === RoleCategory.role_id);
        if(!RoleGuild) return false;

        const hasRole = user.roles.cache.get(RoleCategory.role_id);
        if(hasRole) return true;

        return false;
        
    }

}

export default Discord.getInstance();