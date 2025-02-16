// Import the Student and Course classes
const Student = require('./student');
const Course = require('./course');

const myCourse = new Course("Web Programming II", "Matthew Conroy", "Tuesdays and Thursdays from 5:30PM to 7:07PM");

myCourse.addStudent(new Student("Ian", "Diaz", 19, "Computer Information Systems", 4.0));
myCourse.addStudent(new Student("Zaire", "Thomas", 20, "Computer Information Systems", 3.2));
myCourse.addStudent(new Student("Michelangelo", "Javier", 27, "Computer Information Systems", 3.4));

const courseJSON = myCourse.toJSON();
console.log("\nCourse Saved as JSON String: ");
console.log(courseJSON);

const loadedCourse = new Course();
loadedCourse.loadFromJSON(courseJSON);


console.log("\nLoaded Course Details from JSON: ");
loadedCourse.displayCourseDetails();

