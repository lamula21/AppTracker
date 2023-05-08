const leftHeader = document.querySelector(".month-header");
const leftCalendar = document.querySelector(".calendar");
const leftMonthYear = document.querySelector(".month-year");;
const leftDaysContainer = document.querySelector(".days");
const leftPrev = document.querySelector(".prev");
const leftNext = document.querySelector(".next");
const leftTodayBtn = document.querySelector(".today-btn");

let today = new Date();
let activeDay;
let date = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
const months = [
    "January",
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

function nth(date) {
    if (date > 3 && date < 21) {
        return "th";
    } else {
        let d = date % 10;
        if (d === 1) {
            return "st";
        } else if (d === 2) {
            return "nd";
        } else if (d === 3) {
            return "rd";
        } else {
            return "th";
        }
    }
}

let dates = [];
for (let i = 1; i <= 31; i++) {
    dates.push(`${i}<sup>${nth(i)}</sup>`);
}

function initHeaderMonth() {
    const currMonth = month;
    let currYear = year + 1;
    let headers = "";
    let firstMonth = currMonth - 6;
    if (firstMonth < 0) {
        firstMonth += 13;
        currYear--;
    }
    let count = 1;
    while (count <= 13) {
        if (firstMonth === 12) {
            if (count > 6) {
                headers += `<div class="month-h current-year">${currYear}</div>`;
            } else {
                headers += `<div class="month-h current-year">${currYear}</div>`;
            }
            firstMonth = 0;
            currYear++;
        } else if (firstMonth === currMonth) {
            headers += `<div class="month-h current-month">${months[firstMonth]}</div>`;
            firstMonth++;
        } else {
            headers += `<div class="month-h" onclick="changeMonth(${firstMonth}, ${currYear - 1})">${months[firstMonth]}</div>`;
            firstMonth++;
        }

        count++;
    }

    leftHeader.innerHTML = headers;
}

function changeMonth(selectedMonth, selectedYear) {
    month = selectedMonth;
    year = selectedYear;
    initCalendar();
    initHeaderMonth();
    displayEvents();
}

function changeDay(selectedDay) {
    displayEvents(selectedDay + 1);
}

function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    leftMonthYear.innerHTML = months[month] + " " + year;

    let days = "";
    
    for (let i = day; i > 0; i--){
        days += `<div class="day prev-date">${prevDays - i + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            days += `<div class="day today active" onclick="changeDay(${i-1})">${i}</div>`
        } else {
            days += `<div class="day" onclick="changeDay(${i-1})">${i}</div>`
        }   
    }

    for (let i = 1; i <= nextDays; i++) {
        days += `<div class="day next-date">${i}</div>`
    }
    leftDaysContainer.innerHTML = days;
}


function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
    initHeaderMonth();
    displayEvents();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
    initHeaderMonth();
    displayEvents();
}

initHeaderMonth();
initCalendar();

leftTodayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
    displayEvents();
});


//events part

const rightAddEventBtn = document.querySelector(".add-event");
const rightAddEventContainer = document.querySelector(".add-event-wrapper");
const rightAddEventCloseBtn = document.querySelector(".close");
const rightAddEventTitle = document.querySelector(".event-name");
const rightAddEventFrom = document.querySelector(".event-time-from");
const rightAddEventTo = document.querySelector(".event-time-to");
const rightAddEventAction = document.querySelector(".add-event-btn");
const rightEventDay = document.querySelector(".event-day");
const rightEventDate = document.querySelector(".event-date");
const rightEvents = document.querySelector(".events");

rightAddEventBtn.addEventListener("click", () => {
    rightAddEventContainer.classList.toggle("active");
});

rightAddEventCloseBtn.addEventListener("click", () => {
    rightAddEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (e.target !== rightAddEventBtn && !rightAddEventContainer.contains(e.target)) {
        rightAddEventContainer.classList.remove("active");
    }
});

function convertTime(time) {
    if (time ==="") {
        return "";
    }
    let t = time.split(':');
    const h = Number(t[0]);
    const m = t[1];

    if (h >= 12) {
        let hour = h;
        if (h===12 && m == 0) {
            hour = h;
        } else {
            hour = h - 12;
        }
        return `${hour}:${m}PM`;
    } else {
        let hour = h;
        if (h === 0) {
            hour += 12;
        }
        return `${hour}:${m}AM`;
    }
}

//Add Event to DS
rightAddEventAction.addEventListener("click", (e) => {
    let eventTitle = rightAddEventTitle.value;
    let eventFrom = convertTime(rightAddEventFrom.value);
    let eventTo = convertTime(rightAddEventTo.value);
    //year + month + day + eventTitle + eventFrom + eventTo;
    const currDateFocus = document.querySelector('div.day.active').textContent;
    // console.log(currDateFocus);
    // console.log(year);
    // console.log(month);
    // console.log(eventTitle);
    // console.log(eventFrom);
    // console.log(eventTo);
    let info = {
        date: currDateFocus,
        month: month,
        year: year,
        eventTitle: eventTitle,
        eventFrom: eventFrom,
        eventTo: eventTo
    };
    insert_into_db(info);
});

async function insert_into_db(info) {
    //ehhhh
    // save events on db using fetch POST
    const url = 'http://localhost:5001/user/api/event'


    try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(info),
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`UPS, COULDNT ADD IT IN OUR DB: ${response.statusText}`);
        }
    
        // Reload the page
        location.reload();
    
      } catch (e) {
        throw new Error(`UPS, COULDNT ADD IT IN OUR DB: ${e}`);
      }
    
}

let calendar_events = [];

async function initEvents() {
    const lastDay = (new Date(year, month + 1, 0)).getDate();
    calendar_events = [];
    console.log('INITEVENTS() CALLED')
    console.log(year);
    console.log(month);


    //retrieve from database!
    const userID = document.querySelector('.i').getAttribute('id')
    const url = `http://localhost:5001/user/api/event/${userID}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
          }
        });

        //  IF FAILED Status 300-600
		if (!response.ok) {
			const err = await response.json()
			if (response.status === 404) {
				window.location.href = '/404' // redirect to 404 page
			} else if(response.status === 401) {
				// Create and display alert-div
				alertContainer.innerHTML = `            
				<div class="alert alert-danger" role="alert">
					<i class="bi bi-slash-circle"></i>
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					${err.error}
				</div>`
			}
		}

        // If SUCCESSFUL, populate calendar_events
        const json = await response.json()
        
        //retrieve from database!
        for (let i = 1; i <= lastDay; i++) {
            calendar_events.push([]);

            const all = json.filter((element) => element.date === `${i}` && element.month === `${month}` && element.year === `${year}`);
            
            all.forEach((event) => {
                const { eventTitle, eventFrom, eventTo } = event;
                calendar_events[i - 1].push([eventTitle, eventFrom, eventTo]);
              });
        }

       console.log(calendar_events);

       const doc_days = document.querySelectorAll(".day");

        doc_days.forEach(d => {
            d.classList.remove("event");
        });
        let in_month_dates = [];

       doc_days.forEach(d => {
        if (!d.classList.contains("prev-date") && !d.classList.contains("next-date")) {
            in_month_dates.push(d);
        }});

        for (let i = 0; i < in_month_dates.length; i++) {
            if (calendar_events[i].length !== 0) {
                in_month_dates[i].classList.add("event");
            }
        }



        
    } catch (error) {
        console.log(error);
		// If any error, create and display div-alert	
		// const alertContainer = document.querySelector('.alert-container')
		// alertContainer.innerHTML = `            
		// <div class="alert alert-danger" role="alert">
		// 	<i class="bi bi-slash-circle"></i>
		// 	<button type="button" class="close" data-dismiss="alert" aria-label="Close">
		// 		<span aria-hidden="true">&times;</span>
		// 	</button>
		// 	${error}
		// </div>`
    }
}

async function displayEvents(selectedDay = date) {
    await initEvents();
    // console.log(date);
    // console.log(year);
    // console.log(month);
    const selectDay = new Date(year, month, selectedDay);
    const selectDate = selectDay.getDate();
    rightEventDay.innerHTML = days[selectDay.getDay()] + ",";
    rightEventDate.innerHTML = dates[selectDate - 1];

    const doc_days = document.querySelectorAll(".day");

    doc_days.forEach(d => {
        d.classList.remove("active");
    });

    doc_days.forEach(d => {
        if (!d.classList.contains("prev-date") && !d.classList.contains("next-date")) {
            if (Number(d.innerHTML) === selectedDay) {
                d.classList.add("active");
            }
        }
    });


    let displayEvents = "";

    calendar_events[selectDate - 1].forEach(e => {
        displayEvents += `
        <div class="event">
            <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${e[0]}</h3>
            </div>
            <div class="event-time">${e[1]} - ${e[2]}</div>
        </div>`
    });
    rightEvents.innerHTML = displayEvents;
}

displayEvents();


