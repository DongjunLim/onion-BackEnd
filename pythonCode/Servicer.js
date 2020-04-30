var {PythonShell} = require('python-shell');

module.exports.getCroppedPeople = function (filename){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [filename],
		pythonPath: 'python'
	};

	PythonShell.run('pythonCode/getCroppedPeople.py', options, function (err) {
		if (err) 
			throw err;
		else
			console.log(filename + " is Cropped Successfully!");
	});
}

module.exports.getDominantColorOfImage = function (filename){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [filename],
		pythonPath: 'python'
	};

	PythonShell.run('pythonCode/getDominantColorOfImage.py', options, function (err, result) {
		if (err) 
			throw err;
		else
			console.log("Extract Dominant Color from " + filename + " Successfully!");
			JSON.parse(result);
	});
}

module.exports.fashionClassification = function (filename){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [filename],
		pythonPath: 'python'
	};

	PythonShell.run('pythonCode/fashionClassification.py', options, function (err, result) {
		if (err) 
			throw err;
		else
			console.log(filename + "\'s classfication is Done Successfully!");
			JSON.parse(result);
	});
}