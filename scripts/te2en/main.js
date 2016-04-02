var fs = require('fs');
var file = require('./file');
var os = require("os");

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

var inputMethod = 1;  // RTS
var outputMethod = 0; // Unicode
var transformer = Transformer.createTransformer(inputMethod, outputMethod);

function getKuhu(localeToDataMap) {
  var output = '';
  for (var key in localeToDataMap) {
    output += "LOCALE:" + key + os.EOL + localeToDataMap[key] + os.EOL;
  }
  console.log(output);
  return output;
}

var args = process.argv.slice(2);

file.walk(args[0], function(error, dirPath, dirs, files) {
  files.forEach(function(fileName, index) {
    var fileNameComponents = fileName.split(/[\.\/]/);
    var extension = fileNameComponents.pop();
    var fileNameComponent = fileNameComponents.pop();
    if (extension != 'lrc') {
      return;
    }

    var newfilePath = file.path.join(dirPath, fileNameComponent + '.kuhu');
    var input = fs.readFileSync(fileName).toString();
    var output = transformer.convert(input).toLowerCase();
    var fileData = getKuhu({te: input, en: output});
    fs.writeFile(newfilePath,  fileData, (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
});
