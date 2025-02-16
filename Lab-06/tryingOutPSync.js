class Student {
	constructor(fName, lName, age, major, gpa) {
	
	this.fName = fName;
	this.lName = lName;
	this.age = age;
	this.major = major;
	this.gpa = gpa;
	}
}

function isString(input) {
	if (typeof input == 'string' && isNaN(input)) {
		return true;
	}
	else {
		return false;
	}

}

function isNum(input) {
	const num = Number(input);
	
	if (typeof num == 'number' && !isNaN(num)) {
    		return true;
  	} 
	else {
    		return false;
  	}
}

const prompt = require('prompt-sync')();

const fName = prompt(`What's your first name?: `);
const lName = prompt(`What's your last name?: `);
const age = Number(prompt(`How old are you?: `));
const major = prompt(`What's your major?: `);
const gpa = Number(prompt(`What's your GPA?: `));

const Student1 = new Student(fName, lName, age, major, gpa);

console.log(`\nWhat's up ${Student1.fName} ${Student1.lName}! \n` +
`I see that you're ${Student1.age} years old and are currently studying ${Student1.major} with a GPA of ${Student1.gpa}`);


function validateStudent(student) {
	if (
		isString(student.fName) &&
    		isString(student.lName) &&
    		isNum(student.age) &&
    		isString(student.major) &&
    		isNum(student.gpa)
	) {
		console.log("\nStudent object is valid!");
    		return true;
  } 
	else {
    		console.log("\nStudent object is invalid! Please check the data types.");
    		return false;
  }
}

validateStudent(Student1);
