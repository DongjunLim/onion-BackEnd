var {PythonShell} = require('python-shell');
const util = require('util');

class pythonModule {
	static async resizeImage (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};
		const pythonRunner = util.promisify(PythonShell.run);

		var check = await pythonRunner('pythonCode/resizeImage.py', options)
		.then((result)=>{
			if(result[0] == 'true')
				return true;
			else
				return false;
		})
		.catch((err)=> {
			console.log(err);
			return false;
    	});

		if(check){
			console.log(filename + " is resized Successfully!");
		}

		return check;
	}
	
	static async getCroppedPeople (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};
		const pythonRunner = util.promisify(PythonShell.run);
		var check = await pythonRunner('pythonCode/getCroppedPeople.py', options)
		.then((result)=>{
			if(result[0] == 'true')
				return true;
			else
				return false;
		})
		.catch((err)=> {
			console.log(err);
			return false;
    	});
		if(check){
			console.log(filename + " is Cropped Successfully!");
		}
		return check;
	}

	static async backgroundRemoval (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};
		const pythonRunner = util.promisify(PythonShell.run);

		var check = await pythonRunner('pythonCode/backgroundRemoval.py', options)
		.then((result)=>{
			if(result[0] == 'true')
				return true;
			else
				return false;
		})
		.catch((err)=> {
			console.log(err);
			return false;
    	});

		// await PythonShell.run('pythonCode/getCroppedPeople.py', options, function (err) {
		// 	if (err) 
		// 		throw err;
		// 	else
		// 		console.log(filename + " is Cropped Successfully!");
		// });
		if(check){
			console.log(filename + " \'s background is removed Successfully!");
		}
		return check;
	}

	static async resizeImage (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};
		const pythonRunner = util.promisify(PythonShell.run);

		var check = await pythonRunner('pythonCode/resizeImage.py', options)
		.then((result)=>{
			if(result[0] == 'true')
				return true;
			else
				return false;
		})
		.catch((err)=> {
			console.log(err);
			return false;
    	});

		if(check){
			console.log(filename + " is resized Successfully!");
		}

		return check;
	}

	static async getDominantColorOfImage (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};

		const pythonRunner = util.promisify(PythonShell.run);

		var DominantColorList = await pythonRunner('pythonCode/getDominantColorOfImage.py', options);
		try{
			DominantColorList = await JSON.parse(DominantColorList[0]);
		} catch (error){
			console.log(error);
			return false;
		}
		// await PythonShell.run('pythonCode/getDominantColorOfImage.py', options, function (err, result) {
		// 	if (err) 
		// 		throw err;
		// 	else
		// 		console.log("Extract Dominant Color from " + filename + " Successfully!");
		// 		JSON.parse(result);
		// });

		return DominantColorList;
	}

	static async fashionClassification (filename){
		var options = {
			mode: 'text',
			encoding: 'utf8',
			pythonOptions: ['-u'],
			scriptPath: '',
			args: [filename],
			pythonPath: 'python'
		};

		const pythonRunner = util.promisify(PythonShell.run);

		var fashionClass = await pythonRunner('pythonCode/fashionClassification.py', options);
		
		fashionClass = await JSON.parse(fashionClass[0].replace(/'/gi,'"'));
		// await PythonShell.run('pythonCode/fashionClassification.py', options, function (err, result) {
		// 	if (err) 
		// 		throw err;
		// 	else
		// 		console.log(filename + "\'s classfication is Done Successfully!");
		// 		JSON.parse(result);
		// });
		return fashionClass;
	}
}

module.exports = pythonModule;