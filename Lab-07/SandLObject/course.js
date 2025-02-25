const fs = require('fs/promises');
const Student = require('./student');

class Course {
	constructor(title, description, duration) {
		this.title = title;
		this.description = description;
		this.duration = duration;
		this.students = [];
	}
	addStudent(student) {
		this.students.push(student);
	}
	displayCourseDetails() {
		console.log(`Course Name: ${this.title}`);
		console.log(`Description: ${this.description}`);
		console.log(`Duration: ${this.duration}`);
		this.students.forEach((student, index) => {
			console.log(`${index +1} ${student.name}, Age: ${student.age}, Classes: ${student.classes.join(', ')}`);
		});
	}
	async saveCourseToFile(filename) {
		try {
			const jsonData = JSON.stringify(this);
			await fs.writeFile(filename, jsonData);
			console.log(`Course data saved to: ${filename}`);
		}
		catch (error) {
			console.error(`Error saving course data: ${error}`);
		}
	}
	//static async loadFromFile(filename) {
	//	try {
	//		const fileContent = await fs.readFile(filename, 'utf-8');
	//		const { title, description, duration, students } =
	//	JSON.parse(fileContent);
	//		const course = new Course(title, description, duration);
	//		course.students = students.map(studentData => new
	//		Student(studentData.name, studentData.age, studentData.subjects));
	//		return course;
	//	} 
	//	catch (error) {
	//		console.error(`Error loading course data: ${error}`);
	//	}
	//}
	
	//static async loadFromFile(filename) {
	//	try {
	//		const fileContent = await fs.readFile(filename, 'utf-8');
	//		if (!fileContent.trim()) {
	//			throw new Error('File is empty or contains invalid JSON');
	//		}
	//		const { title, description, duration, students } = JSON.parse(fileContent);
	//		const course = new Course(title, description, duration);
	//		course.students = students.map(studentData => new Student(studentData.name, studentData.age, studentData.classes));
	//		return course;
	//	} catch (error) {
	//		console.error(`Error loading course data: ${error}`);
	//		return null;
	//	}
	//}
	
	static async loadFromFile(filename) {
		try {
			const fileContent = await fs.readFile(filename, 'utf-8');
			if (!fileContent.trim()) {
				throw new Error('File is empty or contains invalid JSON');
			}
	
			// Parse raw JSON into an object
			const parsedData = JSON.parse(fileContent);

			// Reconstruct as a Course instance
			const course = new Course(parsedData.title, parsedData.description, parsedData.duration);
			// Convert each student entry back into a Student instance
			course.students = parsedData.students.map(studentData => 
			new Student(studentData.name, studentData.age, studentData.classes)
			);
			console.error();
			console.log('Parsed Data: ', parsedData.students);
			return course;
		} 
		catch (error) {
			console.error(`Error loading course data: ${error}`);
			return null;
		}
	}
	
}

module.exports = Course;
