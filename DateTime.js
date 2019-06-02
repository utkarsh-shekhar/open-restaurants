class DateTime {
    static getNextDay(day) {
        const numberOfDays = DateTime.DAYS.length;
        const dayIndex = DateTime.DAYS.indexOf(day);
        let nextDayIndex = (dayIndex + 1) % numberOfDays;
        return DateTime.DAYS[nextDayIndex];
    }

    static getDaysFromDayRange(dayRange) {
        const range = dayRange.split('-').map(item => item.trim());
        const startDay = range[0];
        const endDay = range[range.length - 1];
        const start = DateTime.DAYS.indexOf(startDay);
        const end = DateTime.DAYS.indexOf(endDay);
        return DateTime.DAYS.slice(start, end + 1);
    }

    static formatTime(time, period) {
        let hour = Math.floor(time);
        let extra = time - hour;
        if (hour === 12) {
            hour = 0;
        }
        if (period === 'pm') {
            hour += 12;
        }
        return hour + extra;
    }

    static getDayTimeObject(day, startTime, startPeriod, endTime, endPeriod) {
        const startDay = day;
        let endDay = day;
        startTime = DateTime.formatTime(startTime, startPeriod);
        endTime = DateTime.formatTime(endTime, endPeriod);
        if (endTime < startTime) {
            endDay = DateTime.getNextDay(day);
        }
        return {
            startDay,
            endDay,
            startTime,
            endTime,
        }
    }

    static getTimeSlots(getDayTimeObject) {
        const {startDay, endDay, startTime, endTime} = getDayTimeObject;
        let currentDay = getDayTimeObject.startDay;
        let startTimeForThatDay = getDayTimeObject.startTime;
        let endTimeForThatDay = startDay === endDay ? endTime : 24;
        let timeSlots = [];
        for(let currentTime = startTimeForThatDay; currentTime < endTimeForThatDay; currentTime += 0.5) {
            timeSlots.push({
                day: currentDay,
                time: currentTime,
            });
        }
        if(startDay === endDay) {
            return timeSlots;
        }
        currentDay = endDay;
        startTimeForThatDay = 0;
        endTimeForThatDay = endTime ;
        for(let currentTime = startTimeForThatDay; currentTime < endTimeForThatDay; currentTime += 0.5) {
            timeSlots.push({
                day: currentDay,
                time: currentTime,
            });
        }
    
        return timeSlots;
    }
}

DateTime.DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

module.exports = DateTime;