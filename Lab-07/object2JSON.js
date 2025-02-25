const fs = require('fs/promises');

async function saveCourseToFile(course, filename) {
	try {
		const jsonData = JSON.stringify(course);
		await fs.writeFile(filename, jsonData);
		console.log(`Course data saved to ${filename}`);
	}
	catch (error) {
		console.log(`Error saving course data: ${error}`);
	}
}

class Course {
	constructor(courseName, instructor, daysTimes) {
		this.courseName = courseName;
		this.instructor = instructor;
		this.daysTimes = daysTimes;
	}
	async saveToFile(filename) {
		try {
			const newText = JSON.stringify(this);
			await fs.writeFile(filename, newText);
			console.log(`Data successfully written to ${filename}`);
		}
		catch (error) {
			console.log(`Error writing to file: ${filename}`);
		}
	}
	static async loadFromFile(filename) {
		try {
			const fileContent = await fs.readFile(filename, 'utf-8');
			const { courseName, instructor, daysTimes, students } = JSON.parse(fileContent);
			const course = new Course(courseName, instructor, daysTimes);
			course.students = students.map(studentData = new Student(studentData.name, studentData.age, studentDate.subjects));
			return course;
		}
		catch (error) {
			console.error(`Error loading course data: ${error}`);
		}
	}
}

const course = new Course('Web Programming II', 'Matthew Conroy', 'Tuesdays/Thursdays from 5:30pm-7:05pm');

async function loadCourseFromFile(filename) {
	try {
		const fileContent = await fs.readFile(filename, 'utf-8');
		const courseData = JSON.parse(fileContent);
		console.log('Course loaded from JSON file: ', courseData);
	}
	catch (error) {
		console.error(`Error loading course data: ${error}`);
	}
}


saveCourseToFile(course, 'course.json');
course.saveToFile('course2.json');
loadCourseFromFile('course.json');
