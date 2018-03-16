var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird')

var testReport =  '/simplecalc/target/surefire-reports/TEST-com.github.stokito.unitTestExample.calculator.CalculatorTest.xml';

if( process.env.NODE_ENV != "test")
{
    //calculatePriority();
    findFlaky();
}

async function findFlaky()
{
    var flaky = [];

    for( var i = 0; i < 20; i++ )
    {
        try{
            child.execSync('cd simplecalc && mvn test');
        }catch(e){}
        var contents = fs.readFileSync(__dirname + testReport)
        let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
        var tests = readResults(xml2json);
        tests.forEach( e => console.log(i, e));
        console.log();

        tests.forEach(e => {
            if(!(e.name in flaky)){
                flaky[e.name] = {"passed": 0, "failed": 0, "flakyness": 0};
            }

            flaky[e.name][e.status]++;
            flaky[e.name]["flakyness"] = flaky[e.name]["failed"] / (flaky[e.name]["failed"] + flaky[e.name]["passed"]);
        });
    }

    console.log(flaky);   
}

function readResults(result)
{
    var tests = [];
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
        var testcase = result.testsuite.testcase[i];
        
        tests.push({
        name:   testcase['$'].name, 
        time:   testcase['$'].time, 
        status: testcase.hasOwnProperty('failure') ? "failed": "passed"
        });
    }    
    return tests;
}

async function calculatePriority()
{
    try{
        child.execSync('cd simplecalc && mvn test');
    }catch(e){}
    var contents = fs.readFileSync(__dirname + testReport);
    let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
    var tests = readResults(xml2json);
    tests.forEach( e => console.log(e));

    return tests;
}

module.exports.findFlaky = findFlaky;
module.exports.calculatePriority = calculatePriority;