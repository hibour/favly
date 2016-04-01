var fs = require('fs');
eval(fs.readFileSync('Padma.js')+'');
eval(fs.readFileSync('Shared.js')+'');
eval(fs.readFileSync('Telugu.js')+'');
eval(fs.readFileSync('Unicode.js')+'');
eval(fs.readFileSync('Syllable.js')+'');
eval(fs.readFileSync('RTS.js')+'');
eval(fs.readFileSync('parser.js')+'');
eval(fs.readFileSync('RTSParser.js')+'');
eval(fs.readFileSync('Transformer.js')+'');
eval(fs.readFileSync('RTSTransformer.js')+'');


var args = process.argv.slice(2);


var inputMethod = 1;  // RTS
var outputMethod = 0; // Unicode

var input = fs.readFileSync(args[0]) + '';
console.log(">>>>> " + input);
var transformer = Transformer.createTransformer(inputMethod, outputMethod);
console.log(transformer.convert(input).toLowerCase());

