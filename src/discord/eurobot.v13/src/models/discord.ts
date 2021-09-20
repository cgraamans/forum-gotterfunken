import {Message} from "discord.js";
import discord from "../services/discord";

// import * as FileType from "file-type"
// import * as https from "https";

// import Twitter from "../services/twitter";
// import Tools from '../lib/tools';

import {Eurobot} from "../../types/index";

// import db from "../services/db";


export default class DiscordModel {

    constructor() {}

    // comment with emoji and category as options
    public async comment(message:Message,options?:Eurobot.Message.Comment) {
        
        options = Object.assign({category:"default"},options);
        
        const Reactions = discord.Config.Reactions.filter(r=> r.category === options.category);
        if(Reactions.length < 1) return;
        const Reaction = Reactions[Math.floor(Math.random() * (Reactions.length - 1))];

        let comment:string;
        // comment order
        if(Math.random() < 0.5) {
            comment = Reaction.reaction + `${options.emoji ? options.emoji : ""}`;
        } else {
            comment = `${options.emoji ? options.emoji : ""}` + Reaction.reaction;
        }

        return comment;

    }

}