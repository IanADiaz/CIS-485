const Student = require('./student');
const Course = require('./course');

async function main() {
	const course = new Course('Web Programming II', 'This course dives deeper into the backend side of web programming', 'Tuesdays and Thursdays from 5:30pm to 7:05pm');

  	course.addStudent(new Student('Ian Diaz', 19, ['Algebra', 'Calculus']));
  	course.addStudent(new Student('Michelangelo Javier', 27, ['Geometry', 'Statistics']));

  	// Save the Course object to a file
  	await course.saveCourseToFile('course.json');

  	// Load the Course object back from the file
  	const loadedCourse = await Course.loadFromFile('course.json');
  	console.log('Loaded course:', JSON.stringify(loadedCourse, null, 2));
	//console.log('Loaded course:', loadedCourse);
	loadedCourse.displayCourseDetails();
	  
};

	main().catch(error => console.error('Error in main: ', error));
