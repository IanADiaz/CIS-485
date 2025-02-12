const student = {
	name: 'Ian Diaz',
	age: 19,
	subjects: [
		'Digital Forensics',
		'Ethical Hacking',
		'Web Programming II',
		'Database Systems II'
	],
	grade: 4.0
};

console.log('Student Name: ' + student.name + '\nStudent Age: ' + student.age + '\n');

//Lab06 Part 3 JSON in Node.js Steps 2-3
const jsonString = JSON.stringify(student);
console.log('Serialized object: ', jsonString);
const convertedString = JSON.parse(jsonString);
//console.log(convertedString.name + '\n' + convertedString.age);
console.log('\nDeserialized object: ', convertedString);


const course = {
	title: 'Calculus II',
	description: 'Pain...',
	students: [
		{ name: 'Godwin AKPO' },
		{ name: 'Zaire Thomas' },
		{ name: 'Joshua Rodriguez' },
		{ name: 'Julian Hernandez' }
	],
	duration: 120
};

function getStudents() {
	console.log('There are ' + course.students.length + ' students in ' + course.title + '.')
};

getStudents();


class Student {
	constructor(name, age, subjects = []) {
		this.name = name;
		this.age = age;
		this.subjects = subjects;
		}

addSubject(subject) {
	this.subjects.push(subject);
	console.log(subject + ' has been added for ' + this.name + '.');
	}
}

const newStudent1 = new Student('Dan Grigs', 22);
newStudent1.addSubject('Calculus II');
newStudent1.addSubject('English II');
newStudent1.addSubject('Intro To Physics');
console.log('Dan Grigs is now enrolled in: ' + newStudent1.subjects);


class Course {
	constructor(title) {
		this.title = title;
		this.students = [];
	}

	getAvgAge() {
		if (this.students.length === 0) {
			return 0;
		}
		let sumAges = this.students.reduce((sum, student) => sum + student.age, 0);
		return sumAges / this.students.length;
		
	}
}

const philCourse = new Course("Philosophy");

const newStudent2 = new Student("Jeff Moore", 20);
const newStudent3 = new Student("Dimitri Assante", 24);

philCourse.students.push(newStudent1);
philCourse.students.push(newStudent2);
philCourse.students.push(newStudent3);

console.log('The Students: \n' + newStudent1.name + ' | Age: ' + newStudent1.age + ', \n' + newStudent2.name + ' | Age: ' + newStudent2.age + ', \n' + newStudent3.name + ' | Age: ' + newStudent3.age + ', \nhave been added to the Course: ' + philCourse.title);


console.log('The average age of students in this course is: ', philCourse.getAvgAge());


const studentArray = [
	new Student('Bob Ryan',	20, ['Math', 'History']),
	new Student('Bill Nye', 21, ['Chemistry', 'Math']),
	new Student('Ryan Conner', 24, ['History', 'Biology'])
];

console.log('Original student array: ', studentArray);

const studentsJSON = JSON.stringify(studentArray);
console.log('\nJSON String: ', studentsJSON);

const parsedStudents = JSON.parse(studentsJSON);
console.log('\nParsed Student Array: ', parsedStudents);
