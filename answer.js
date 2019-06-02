const readEachLineSync = require('read-each-line-sync');
const TimeTable = require('./TimeTable');

const timetable = new TimeTable();
readEachLineSync('restaurants.csv', list => timetable.process(list));

const restaurantsOpenNow = timetable.openRestaurants('02-06-2019 14:05:09:00');
console.log(restaurantsOpenNow)
console.log(restaurantsOpenNow.length)
