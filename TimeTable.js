const DateTime = require('./DateTime');

class TimeTable {
    constructor() {
        this.timetable = {
            Mon: {},
            Tue: {},
            Wed: {},
            Thu: {},
            Fri: {},
            Sat: {},
            Sun: {},
        };
    }

    addToTimeTable(day, time, restaurant) {
        if (!this.timetable[day][time]) {
            this.timetable[day][time] = [];
        }
        this.timetable[day][time].push(restaurant);
    }

    addToHour(day, hour, restaurant) {
        this.addToTimeTable(day, hour, restaurant, this.timetable);
        this.addToTimeTable(day, hour + 0.50, restaurant, this.timetable);
    }

    addToDay(day, restaurant) {
        for (let hour = 0; hour < 24; hour++) {
            this.addToHour(day, hour, restaurant, this.timetable);
        }
    }

    handleAllDayRestaurants(dayRange, restaurant) {
        const days = DateTime.getDaysFromDayRange(dayRange);
        days.forEach(day => this.addToDay(day, restaurant, this.timetable));
    }

    handleLimitedTimeRestaurants(dateTimeRange, restaurant) {
        let [dayRange, startTime, startPeriod, _dash, endTime, endPeriod] = dateTimeRange.split(' ');
        if (startTime.split(':').length > 1) {
            startTime = parseInt(startTime.split(':')[0]) + 0.5;
        } else {
            startTime = parseInt(startTime);
        }
        if (endTime.split(':').length > 1) {
            endTime = parseInt(endTime.split(':')[0]) + 0.5;
        } else {
            endTime = parseInt(endTime);
        }
        const days = DateTime.getDaysFromDayRange(dayRange);
        const dayTimeObjects = days.map(day => DateTime.getDayTimeObject(
            day,
            startTime,
            startPeriod,
            endTime,
            endPeriod
        ));
        const timeSlots = dayTimeObjects.reduce((aggregator, dayTimeObject) => {
            return aggregator.concat(DateTime.getTimeSlots(dayTimeObject));
        }, []);

        timeSlots.forEach(timeSlot => {
            const { day, time } = timeSlot;
            this.addToTimeTable(day, time, restaurant);
        });
    }

    openRestaurants(openDatetime) {
        const date = new Date(openDatetime);
        let dayIndex = date.getDay() - 1;
        if (dayIndex === -1) {
            dayIndex = 6;
        }
        const day = DateTime.DAYS[dayIndex];
        const hour = parseInt(date.getHours());
        const minutes = date.getMinutes();
        const delta = (parseInt(minutes / 30) * 0.5);
        const time = hour + delta

        return this.timetable[day][time] || [];
    }

    handleTimePeriodString(timePeriodString, restaurant) {
        const timePeriods = timePeriodString.split('/').map(item => item.trim());
        timePeriods.forEach(timePeriod => this.handleLimitedTimeRestaurants(
            timePeriod,
            restaurant,
        ));
    }

    process(line) {
        let columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(item => item.trim());
        columns = columns.map(column => {
            if (column[0] === '"' && column[column.length - 1] === '"') {
                column = column.substring(1, column.length - 1)
            }
            return column;
        });
        const restaurant = columns[0];
        const timerange = columns[1];

        const split = timerange.split(',').map(item => item.trim());
        if (split.length > 2) {
            const dayRange = split[0];
            this.handleAllDayRestaurants(dayRange, restaurant);
            const timePeriodString = split[split.length - 1];
            this.handleTimePeriodString(timePeriodString, restaurant);
        } else {
            // check if this is timePeriodString or dayRange
            if (timerange.match(/[0-9]/)) {
                // this is a timeperiod string
                this.handleTimePeriodString(timerange, restaurant);
            } else {
                this.handleAllDayRestaurants(timerange, restaurant);
            }
        }
    }
}

module.exports = TimeTable;