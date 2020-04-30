var {PythonShell} = require('python-shell');
const util = require('util');

class pythonModule {
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

		await pythonRunner('pythonCode/getCroppedPeople.py', options);

		// await PythonShell.run('pythonCode/getCroppedPeople.py', options, function (err) {
		// 	if (err) 
		// 		throw err;
		// 	else
		// 		console.log(filename + " is Cropped Successfully!");
		// });

		console.log(filename + " is Cropped Successfully!");
		return true;
	} catch (err) {
		console.log(err);
		return false;
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
		console.log(DominantColorList);
		DominantColorList = await JSON.parse(DominantColorList);

		// await PythonShell.run('pythonCode/getDominantColorOfImage.py', options, function (err, result) {
		// 	if (err) 
		// 		throw err;
		// 	else
		// 		console.log("Extract Dominant Color from " + filename + " Successfully!");
		// 		JSON.parse(result);
		// });

		return DominantColorList;
	} catch (err) {
		console.log(err);
		return false;
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
	} catch (err) {
		console.log(err);
		return false;
    }
}

module.exports = pythonModule;