import {calendar as CalendarOptions} from "../conf/google/options.json"
import Discord, { Message } from "discord.js";
import {Google} from "../services/google";
import {Tools} from "../lib/tools";

export class GoogleCalendarModel {

    constructor() {}

    // Convert human calendar times to Date object ranges (ms)
    // CalendarUnixTimes
    public CalendarTextToUnixTimes(text:string) {

        let rtn:{from:Date,to?:Date,human:string} = {
            from:new Date(new Date().setHours(0,0,0,0)),
            human:"this week"
        };
        rtn.to = new Date(rtn.from.getTime() + (86400000 * 7) - 1);

        if(text.includes("tomorrow")) {
    
            rtn.from = new Date(new Date(new Date().getTime() + 86400000).setHours(0,0,0,0));
            rtn.to = new Date(new Date(rtn.from).getTime() + (86400000));
            rtn.human = "tomorrow";
    
        }

        if(text.includes("today")) {
    
            rtn.from = new Date(new Date().setHours(0,0,0,0));
            rtn.to = new Date(rtn.from.getTime() + (86400000 -1));
            rtn.human = "today";
    
        }
    
        if(text.includes("next week")) {
    
            rtn.from = new Date(new Date(new Date().getTime() + (86400000 * 7)).setHours(0,0,0,0));
            rtn.to = new Date(rtn.from.getTime() + (86400000 * 7) - 1);
            rtn.human = "next week";
    
        }

        const smhd = Tools.stringDateSMHDToTime(text);
        if(smhd) {

            rtn.from = new Date(new Date().setHours(0,0,0,0));
            rtn.to = new Date(rtn.from.getTime() + (smhd -1));
            rtn.human = Tools.stringDateSMHDToHuman(text);

        }

        return rtn;

    } // CalendarUnixTimes

    // Convert items from google calendar service to rich output
    // toRich
    public toRich(items:any[],Range:any):Discord.MessageEmbed|null {

            if(items.length < 1) return null;

            let calendarString:string = "";

            calendarString = `Calendar for ${Range.human}\n\n`;

            let itemLengthString = "";
            if(items.length > CalendarOptions.maxItems) {
            
                let LenPos = items.length - CalendarOptions.maxItems;
                itemLengthString = `... and ${LenPos} more.\n\n`;
                items.splice((-1 * LenPos),LenPos);

            }

            let calendar = "";

            for(let item of items){

                if(item.start && item.end && item.status === "confirmed") {

                    let description = "";
                    let dateString = "";
        
                    if(item.start.date && item.end.date) {
    
                        dateString = `${item.start.date}`;
                        if(((new Date(item.end.date).getTime()) - (new Date(item.start.date).getTime())) !== 86400000) {
                            dateString += ` - ${item.end.date}`;
                        }
    
                    }
    
                    if(item.start.dateTime && item.end.dateTime) {
    
                        dateString = Tools.dateTimeToHHss(new Date(item.start.dateTime));
        
                        if((new Date(item.end.dateTime).getTime()) - (new Date(item.start.dateTime).getTime()) > 86400000) {
                            dateString += (" - " + (Tools.dateTimeToHHss(new Date(item.end.dateTime))));
                        } 
        
                    }
        
                    if(item.description) description = `${item.description}\n`;
        
                    calendar += `**${item.summary}**\n${dateString}\n${description}\n`;    

                }
    
            };
                    
            calendarString = calendarString + calendar; 

            return new Discord.MessageEmbed()
                .setTitle(`Forum Götterfunken Calendar`)
                .setDescription(calendarString)
                .setColor(0x003399)
                .setFooter(itemLengthString);

    } // toRich

    // Get the calendar by command options
    // get
    public async get(Range:{from:Date,to?:Date,human:string}) {

        return await Google.Calendar(Range.from,Range.to).catch((e:any)=>{console.log(e)});

    } // get

}