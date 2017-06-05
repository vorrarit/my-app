const express = require('express');
const app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(morgan());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.send('Hello World!');
});

function calcDocumentNo(defaultDocumentNo) {
	//TODO
	return defaultDocumentNo;
}

function calcExpiryDate(defaultExpiryDate) {
	//TODO
	return defaultExpiryDate;
}

function calcCheckDigit(input) {
	console.log('input ' + input);
	var lookup = { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '<': '0', 'A': '10', 'B': '11', 'C': '12', 'D': '13', 'E': '14', 'F': '15', 'G': '16', 'H': '17', 'I': '18', 'J': '19', 'K': '20', 'L': '21', 'M': '22', 'N': '23', 'O': '24', 'P': '25', 'Q': '26', 'R': '27', 'S': '28', 'T': '29', 'U': '30', 'V': '31', 'W': '32', 'X': '33', 'Y': '34', 'Z': '35' };
	var sumCheckDigit = 0;
	for (var i=0; i<input.length; i++) {
		var inputChar = input.substr(i, 1);
		var inputCharValue = lookup[inputChar] * 1;
		var weight = (i % 3 == 0 ? 7 : (i % 3 == 1? 3: 1));
		console.log('inputChar ' + inputChar + ', inputCharValue ' + inputCharValue + ', weight ' + weight);
		sumCheckDigit += inputCharValue * weight;
		console.log('sumCheckDigit ' + sumCheckDigit);
	}
	console.log(sumCheckDigit % 10);
	return sumCheckDigit % 10;
}

function rightpad(input, length, pad) {
	if (input.length >= length)
		return input.substr(0, length);
	else
		return (input + pad.repeat(length)).substr(0, length);
}

/*
name
surname
nationality
dob
personal number
sex
dob
*/
app.post('/', function(req, res) {
	var data = req.body;
	data.documentType = 'P';
	data.issuer = 'THA';
	data.documentNumber = calcDocumentNo('AA3548982');
	data.nationality = 'THA';
	data.expiryDate = calcExpiryDate('190820');

	var mrz1 = data.documentType + '<' + data.issuer + rightpad(data.surname + '<<' + data.name, 39, '<');
	var mrz2 = rightpad(data.documentNumber, 9, '<') + calcCheckDigit(rightpad(data.documentNumber, 9, '<')) +
			data.nationality +
			data.dateOfBirth + calcCheckDigit(data.dateOfBirth) + data.sex + 
			data.expiryDate + calcCheckDigit(data.expiryDate) + rightpad(data.personalNumber, 14, '<') + calcCheckDigit(data.personalNumber);
	var digitForFinalCheck = mrz2.substr(0, 10) + mrz2.substr(13, 7) + mrz2.substr(21, 22);
	console.log('digitForFinalCheck ' + digitForFinalCheck);
	mrz2 += calcCheckDigit(digitForFinalCheck);

	console.log(req.body);
	res.end(mrz1 + '\r\n' + mrz2);
});

app.listen(3000, function() {
	console.log('Server Started');
});