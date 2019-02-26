const SunCalc = require('suncalc');



class Day {
    constructor(year, month, day, current) {
        
        this.current = current ? true : false
        this.month = month
        this.day = day
        this.year = year
        this.date = new Date(year, month, day)
        this.requestMoon()
    }

    paintDay() {

        this.el = document.createElement('div')
        this.el.classList.add("day")
        this.el.id = this.date.toLocaleDateString()

        // able to turn off if desirable to show previous/next month dates
        this.el.innerText = this.current ? this.day : ""
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
       
        // idenitfy days with illumination with more than 90%
        if (this.moonIllumination > .9 && this.current ) {
            this.el.classList.add('full-moon')
        }

        return this.el
    }

    async paintHotDay() {
        let response = await this.requestHighLow()
        this.setHighLow(response)
        
        if (this.low['v'] < 0 && this.current) {
            this.el.classList.add('steam-day')
        }
    }


    get(url, callback) {
        const getRequest = new XMLHttpRequest();
        getRequest.open("get", url, true);
        getRequest.addEventListener("readystatechange", function() {
        if (getRequest.readyState === 4 && getRequest.status === 200) {
            return callback(getRequest.responseText);
        }
        });
    
        getRequest.send();

    }

    requestHighLow() {
        let month
        switch (this.month) {
            case 11:
                month = 12
            case 10:
                month = 11
            case 9:
                month = 10
            default:
                month = `0${this.month + 1}`
        }
        let fromDateArg = `${this.date.getFullYear()}${month}${this.day < 10 ? `0${this.day}` : this.day}`

        return new Promise((resolve, reject) => {
            this.get(
            `https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=${fromDateArg} 00:01&end_date=${fromDateArg} 23:00&station=9414958&product=predictions&datum=mllw&units=english&time_zone=gmt&application=web_services&format=json`, 
            (response) => {
                resolve(response)
            })

        })
        
    }

    setHighLow(response) {
        let parsed = JSON.parse(response)
        let high = {'v': undefined}
        let low = {'v': undefined}
        
        parsed.predictions.forEach(time => {
            high = parseFloat(high['v']) > parseFloat(time["v"]) ? high : time
            low = parseFloat(low['v']) < parseFloat(time["v"]) ? low : time
        })
        
        this.high = {
            't': new Date(high['t']),
            'v': parseFloat(high['v']) 

        }
        
        this.low = {
            't': new Date(low['t']),
            'v': parseFloat(low['v']) 

        }
        
        
    }
     
    requestMoon() {
        const moonData = SunCalc.getMoonIllumination(this.date)
        this.moonIllumination = moonData.fraction
        this.moonPhase = moonData.phase
        
    }

}


export default Day;