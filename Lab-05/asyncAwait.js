function doTask(taskName) {
	return new Promise((resolve, reject) => {
		console.log(`Starting Task: ${taskName}`);
		setTimeout(() => {
			if (taskName === 'Task 2') {
				reject('Error: Something went wrong with Task 2!');
			}
			else {
				console.log(`Completed Task: ${taskName}`);
				resolve();
			}
		}, 1000);
	});
}

async function runTasks() {
	try {
		await doTask('Task 1');
		await doTask('Task 2');
		await doTask('Task 3');
		console.log('All Tasks Completed!');
	}
	catch (error) {
		console.log(error);
	}
}

runTasks();
