
export class ToolBox {
    
    // async foreach
    // reference: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    public async asyncForEach(array:any, callback:any) {
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
    getStringMultiplicity(number:number,string:string){
        
        return number !== 1 ? string + "s" : string;
    
    }

}

export const Tools = new ToolBox();