import {google} from 'googleapis';
import privatekey from "../conf/calendar/Eurobot-Calendar-1c54f0456b16.json"

export class GoogleFactory {

    private static instance:GoogleFactory;

    private jwtClient:any;

    public calendar:any;

    constructor() {

        //Google Calendar API
        this.calendar = google.calendar('v3');

        // configure a Google JWT auth client
        this.jwtClient = new google.auth.JWT(

            privatekey.client_email,
            null,
            privatekey.private_key,
            ['https://www.googleapis.com/auth/calendar']

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

}

export const Google = GoogleFactory.getInstance();