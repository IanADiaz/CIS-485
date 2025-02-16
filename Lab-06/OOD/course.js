const Student = require('./student'); 

class Course {
	constructor(courseName, instructor, daysTimes) {
    		this.courseName = courseName;
    		this.instructor = instructor;
		this.daysTimes = daysTimes
    		this.students = []; 
  		}

  
	addStudent(student) {
    		this.students.push(student);
  		}

  
	getAvgAge() {
    		if (this.students.length === 0) return 0;

    		const totalAge = this.students.reduce((sum, student) => sum + student.age, 0);
    		return (totalAge / this.students.length);
  		}

	toJSON() {
    		return JSON.stringify({
      		courseName: this.courseName,
      		instructor: this.instructor,
		daysTimes: this.daysTimes,
      		students: this.students,
      		averageAge: this.getAvgAge()
    		})
  	}

	loadFromJSON(jsonString) {
    		const data = JSON.parse(jsonString);
    		this.courseName = data.courseName;
    		this.instructor = data.instructor;
		this.daysTimes = data.daysTimes;
    		this.students = data.students.map(stu => new Student(stu.fName, stu.lName, stu.age, stu.major, stu.gpa));
  	}

	displayCourseDetails() {
    		console.log(`\nCourse Name: ${this.courseName}`);
    		console.log(`Instructor: ${this.instructor}`);
		console.log(`Class Days/Times: ${this.daysTimes}`);
		console.log(`Average Student Age: ${this.getAvgAge()}`);
    		console.log("\nStudents: ");
    		this.students.forEach((student, index) => {
      			console.log(`${index + 1}. ${student.fName} ${student.lName}, Age: ${student.age}, Major: ${student.major}, GPA: ${student.gpa}`);
    		});
  	}
}


module.exports = Course;

