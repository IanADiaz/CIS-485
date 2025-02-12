console.log('Q: Why is JSON important for data interchange between systems?' + '\n' + 
		'A: JSON is a universal and lightweight format standard for APIs, requires less bandwidth and space than XML making it suitable for web services' + '\n');

const student = {
	fName: 'Ian',
	lName: 'Diaz',
	age: 19,
	gpa: 4.0 
}


//Lab06 Part 3 JSON in Node.js (step 1)
const jsonString = JSON.stringify(student);
const convertedString = JSON.parse(jsonString);
console.log(convertedString);



