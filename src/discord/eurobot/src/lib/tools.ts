export class ToolBox {
    
    // async foreach
    // reference: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    async asyncForEach(array:any, callback:any) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    // debounce for timers
    debounce(func:any, wait:number, immediate?:any) {
        var timeout:any;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // shuffle array 
    // refference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleArray(array:any[]) {

        if(array.length < 1) return [];

        let currentIndex = array.length, 
            temporaryValue, 
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;

        }

        return array;

    }

    // Put an 's' at the end of a word if num > 0
    stringMultiplicity(number:number,string:string){
        
        return number !== 1 ? string + "s" : string;
    
    }

    // YYYY-MM-DD HH:ss output.
    dateTimeToHHss(DateObj:Date) {

        let mm = DateObj.getMonth() + 1,
        dd = DateObj.getDate();

        let date = [
            DateObj.getFullYear() + "-",
            (mm>9 ? "" : "0") + mm + "-",
            (dd>9 ? "" : "0") + dd
        ].join("");
                
        return date + " " + [
                (DateObj.getHours() > 9 ? "" : "0") + DateObj.getHours() +":",
                (DateObj.getMinutes() > 9 ? "" : "0") + DateObj.getMinutes()
            ].join(""); 

    }

    stringDateSMHDToTime(string:string) {

        const matches = string.match(/(\d?\d[dhms])/);
        if(matches.length > 0) {

            const exploded = matches[0].split("");
            const pop = exploded.pop();

            let time:number;

            if(pop === "s") time = 1000;
            if(pop === "m") time = 60000;
            if(pop === "h") time = 3600000;
            if(pop === "d") time = 86400000;

            return time;

        }

        return;

    }

}

export const Tools = new ToolBox();