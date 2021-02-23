const fs = require('fs');

async function readFileSync (fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

async function writeFileSync (fileName, text) {
	return new Promise((resolve, reject) => {
		fs.open(fileName, 'w+', (err, fd) => {
			if (err) {
				reject(err);
			}
			fs.appendFile(fileName, text, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	});
};

module.exports = {
	readFileSync,
	writeFileSync
};
