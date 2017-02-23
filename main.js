var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();

var testReport =  '/simplecalc/target/surefire-reports/TEST-com.github.stokito.unitTestExample.calculator.CalculatorTest.xml';

try{
    child.execSync('cd simplecalc; mvn test');
}
catch(e)
{
    //console.log(e);
}
fs.readFile(__dirname + testReport, function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        // Print out everything
        //console.dir(JSON.stringify(result,null, 3));
        console.log('Done');
    });
});
