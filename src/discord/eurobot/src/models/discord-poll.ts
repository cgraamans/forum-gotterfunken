import Discord from "discord.js";
import {Tools} from "../lib/tools";
import * as Types from "../types/index.d";
import {DiscordModelMessage} from "./discord-message";

export class DiscordModelPoll {


    constructor(command?:Types.DiscordModelMessage.CommandModel) {


    }

    private CommandOptionsFilter(options:string[]) {

        let Options = options.filter(option=>{
            return !Tools.stringDateSMHDToTime(option);
        })

        Options = Options.filter(option=>{
            return !option.match(Discord.MessageMentions.CHANNELS_PATTERN)
        });

        return Options;
    }


    get() {

        // fetchedMessages.find(m => (m.embeds.length > 0) && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(emoji) && m.embeds[0].footer.text.endsWith(message.id));

    }

    update(message:Discord.Message) {



    }

    post(command:Types.DiscordModelMessage.CommandModel,message:Discord.Message) {
 
        const ModelMessage = new DiscordModelMessage(message)

        let poll = {

            filtered:this.CommandOptionsFilter(command.options),
            channel:ModelMessage.CommandGetOptionsChannels(command.options)

        };

        console.log(poll);

        // command.ModelOptions = {
        //     channels:this.CommandGetOptionsChannels(Command.options),
        //     times:this.CommandGetOptionsTime(Command.options),
        //     filtered:
        // };



        // post to channel(s)
        // times

        /*


        */

        // console.log(this.Command);


    }

    // Convert poll to rich output
    // toRich
    public toRich(poll:string,time:number) {



    } // toRich




}