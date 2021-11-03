import {calendar as CalendarOptions} from "../../conf/google/options.json"
import Discord from "discord.js";
import Tools from '../tools';
import {Eurobot} from "../../types/index";
import db from "../services/db";

export class Calendar {

    constructor() {}

    // Convert human calendar times to Date object ranges (ms)
    // textToUnixTimeRange
    public textToUnixTimeRange(text?:string) {

        // initial return object
        let rtn:Eurobot.Calendar.Span = {
            human: "today",
            range: {
                from:new Date(new Date().setHours(0,0,0,0)),
            }
        };
        rtn.range.to = new Date(rtn.range.from.getTime() + 86400000 - 1);

        if(text) {

            if(text.includes("tomorrow")) {
    
                rtn.range.from = new Date(new Date(new Date().getTime() + 86400000).setHours(0,0,0,0));
                rtn.range.to = new Date(new Date(rtn.range.from).getTime() + (86400000));
                rtn.human = "tomorrow";

                return rtn;
                
            }

            if(text.includes("week")) {
        
                rtn.range.from = new Date(new Date().setHours(0,0,0,0));
                rtn.range.to = new Date(rtn.range.from.getTime() + (86400000 * 7) - 1);
                rtn.human = "this week";

                return rtn;

            }

            const dhms = Tools.dateStringToMS(text);
            if(dhms) {
    
                rtn.range.from = new Date(new Date().setHours(0,0,0,0));
                rtn.range.to = new Date(rtn.range.from.getTime() + (dhms -1));
                rtn.human = Tools.dateStringToHuman(text);
    
                return rtn;

            }

        }

        return rtn;

    } // CalendarUnixTimes

    // Convert items from google calendar service to rich output
    // toRich
    public toRich(items:any[],span:Eurobot.Calendar.Span):Discord.MessageEmbed|null {

            let calendarDescription:string = `Calendar for ${span.human}\n\n`;

            let footer = "";
            if(items.length > CalendarOptions.maxItems) {
            
                let LenPos = items.length - CalendarOptions.maxItems;
                footer = `... and ${LenPos} more.\n\n`;
                items.splice((-1 * LenPos),LenPos);

            }

            let calendar = "";
            if(items.length < 1) {
                calendar = `No entries.`;
            }

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
    
                        dateString = Tools.dateToHHss(new Date(item.start.dateTime));
        
                        if((new Date(item.end.dateTime).getTime()) - (new Date(item.start.dateTime).getTime()) > 86400000) {
                            dateString += (" - " + (Tools.dateToHHss(new Date(item.end.dateTime))));
                        } 
        
                    }
        
                    if(item.description) description = `${item.description}\n`;
        
                    calendar += `🔹**${item.summary}**\n${dateString}\n${description}\n`;    

                }
    
            };
                    
            return new Discord.MessageEmbed()
                .setTitle(`🇪🇺 Eurobot Calendar`)
                .setDescription(calendarDescription + calendar)
                .setColor(0xFFCC00)
                .setFooter(footer);

    } // toRich

    // Create rich message from Event
    //toRichEvent
    public toRichEvent(event:any) {

        let description = "";
        if(event.description) description = `${event.description}\n`;
          
        return new Discord.MessageEmbed()
        .setTitle(`🇪🇺 Event Starting!`)
        .setDescription(`🔹**${event.summary}**\n${description}\n\nStarts: ${event.start.dateTime}\nEnds: ${event.end.dateTime}`)
        .setColor(0xFFCC00)

    } //toRichEvent

    // Get Calendar log for ID from table 
    // getCalendarLogID
    public async getLogID(id:string) {

        const ids:any[] = await db.q(`SELECT * FROM calendar_log WHERE id = ?`,[id]);
        console.log(ids);
        if(ids && ids.length > 0) return ids[0];
        return;

    } // getCalendarLogID

    public async postLogID(eventID:string) {
        return await db.q(`INSERT INTO calendar_log SET ?`,[{id:eventID}]);
    }

}