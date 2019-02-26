import Month from './month'


class Calender {
    constructor(el) {
        this.el = el

        this.events = {}
        this.clickEvents = {}

        this.today = new Date()
        this.startofMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1)
        this.currMonth = new Month(this.today)

        this.loadNextMonth = this.loadNextMonth.bind(this)
        this.loadPreviousMonth = this.loadPreviousMonth.bind(this)
        this.addClick = this.addClick.bind(this)
        this.addTitle = this.addTitle.bind(this)
        this.mountDays = this.mountDays.bind(this)
       
        this.months = {
            0: "January",
            1: "Febuary",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        }
        this.constructEl.call(this)
    }


    constructEl(){
        // create container for buttons and title
        this.tilebar = document.createElement('div')
        this.tilebar.classList.add("ezCal-titlebar")


        

        

        // create previous mont buttons
        this.previousMonthButton = document.createElement('button')
        this.previousMonthButton.classList = 'ez-cal-button'
        this.previousMonthButton.innerText = "prev"
        this.previousMonthButton.addEventListener('click', this.loadPreviousMonth)
        this.tilebar.appendChild(this.previousMonthButton)

        // create header with current month
        this.title = document.createElement('h3')
        this.title.innerText = `${this.months[this.startofMonth.getMonth()]} ${this.startofMonth.getFullYear()}`
        this.tilebar.appendChild(this.title)

        // create next month button
        this.nextMonthButton = document.createElement('button')
        this.nextMonthButton.innerText = 'next'
        this.nextMonthButton.classList = 'ez-cal-button'
        this.nextMonthButton.addEventListener('click', this.loadNextMonth)
        this.tilebar.appendChild(this.nextMonthButton)

        // construct element 
        this.el.innerHTML = ""
        this.el.appendChild(this.tilebar)
        this.el.appendChild(this.currMonth.paintMonth())

    }

    loadNextMonth() {
        this.startofMonth = new Date(
            this.startofMonth.getMonth() === 11 ? this.startofMonth.getFullYear() + 1 : this.startofMonth.getFullYear(),
            this.startofMonth.getMonth() === 11 ? 0 : this.startofMonth.getMonth() + 1,
            1)
        
        this.currMonth = new Month(this.startofMonth)

        this.constructEl()

        this.mountDays()
    }

    loadPreviousMonth() {
        this.startofMonth = new Date(
            this.startofMonth.getMonth() === 0 ? this.startofMonth.getFullYear() - 1 : this.startofMonth.getFullYear(),
            this.startofMonth.getMonth() === 0 ? 11 : this.startofMonth.getMonth() - 1,
            1)
        this.currMonth = new Month(this.startofMonth)

        this.constructEl()

        this.mountDays()
        
    }

    // build library of titles for display of current month
    addTitle(day, title){
        if (this.events[day.toLocaleDateString()]) {
            this.events[day.toLocaleDateString()].push(title)
        } else {
            this.events[day.toLocaleDateString()] = [title]
        }
    }

    // add callback to onClick of day 
    addClick(day, callback){
        this.clickEvents[day.toLocaleDateString()] = callback 
        
    }

    // mount display divs to display on days on hover
    mountDays() {
        this.currMonth.days.forEach(day => {
            let dayEl
            
            if (this.events[day.date.toLocaleDateString()]) {
                let titleList = document.createElement('ul')
                titleList.classList.add('title-list')
                this.events[day.date.toLocaleDateString()].forEach(title => {
                    let titleEl = document.createElement('li')
                    titleEl.innerText = title
                    titleList.appendChild(titleEl)
                })
                dayEl = document.getElementById(day.date.toLocaleDateString())
                dayEl.appendChild(titleList)
                dayEl.classList.add("event-day")
            }
            
            if (this.clickEvents[day.date.toLocaleDateString()]) {
                let dayEl = document.getElementById(day.date.toLocaleDateString())
                
                dayEl.addEventListener('click', this.clickEvents[day.date.toLocaleDateString()])
                dayEl.classList.add('mounted')
            }
        })
    }

}

export default Calender;