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
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
    initHeaderMonth();
}

initHeaderMonth();
initCalendar();

leftTodayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});


//events part
/* 
const { MongoClient, ServerApiVersion } = require("mongodb");
const databaseAndCollection = {
    db: "appTracker",
    collection: "calendar",
  };
const uri = process.env.URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
}); */


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
    if (e.target !== addEventBtn && !rightAddEventContainer.contains(e.target)) {
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
    let info = {
        year: year,
        month: month,
        date: date,
        eventTitle: eventTitle,
        eventFrom: eventFrom,
        eventTo: eventTo
    };
    insert_into_db(info);
});

/* async function insert_into_db(info) {
    try {
      await client.connect();
      await client
        .db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .insertOne(info);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
} */


let calendar_events = [];

function initEvents() {
    const lastDay = (new Date(year, month + 1, 0)).getDate();
    for (let i = 1; i <= lastDay; i++) {
        calendar_events.push([[`event day ${i}`, "10AM", "12PM"]]);
    }
}

function displayEvents(selectedDay = date) {
    initEvents();
    date = selectedDay;
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


