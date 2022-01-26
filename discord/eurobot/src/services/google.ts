import privatekey from "../conf/google/Eurobot-Calendar-1c54f0456b16.json"
import {google} from "googleapis";
import {calendar as CalendarOptions} from "../conf/google/options.json"

export class GoogleFactory {

    private static instance:GoogleFactory;

    private jwtClient:any;

    public calendar:any;

    constructor() {

        //Google Calendar API
        this.calendar = google.calendar("v3");

        // configure a Google JWT auth client
        this.jwtClient = new google.auth.JWT(

            privatekey.client_email,
            null,
            privatekey.private_key,
            ["https://www.googleapis.com/auth/calendar"]

        );

        //Google API authenticate request
        this.jwtClient.authorize(function (err:any, tokens:any) {

            if (err) {
                throw err;
            } else {
                console.log("Successfully connected to Google API");
            }

        });

    }

    // Service Instance Initialization
    static getInstance() {
        
        if (!GoogleFactory.instance) {
            GoogleFactory.instance = new GoogleFactory();
        }
        return GoogleFactory.instance;

    }

    // Retrieve Google Calendar
    public Calendar(from?:Date,to?:Date):Promise<any> {

        if(!from) from = new Date(new Date().setHours(0,0,0,0));
        if(!to) to = new Date(from.getTime() + (86400000 -1));;

        return new Promise((resolve,reject)=>{

            this.calendar.events.list({
            
                auth: this.jwtClient,
                calendarId: CalendarOptions.calendarID,
                timeMin:from,
                timeMax:to,
                singleEvents:true,
                orderBy:"startTime"
                
            }, function (err:any, response:any) {
        
                if (err) {

                    console.log("The Google Calendar API returned an error: " + err);
                    reject(err);
                
                } else {

                    if(response && response.data && response.data.items) {
        
                        resolve(response.data.items);
        
                    } else {
        
                        reject("The Google Calendar API returned an incompatible object");
        
                    }
        
                }

            });

        });

    }

    
}

export const Google = GoogleFactory.getInstance();