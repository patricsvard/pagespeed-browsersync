const psi = require('psi');
const browserSync = require('browser-sync').create();
const urlPattern = new RegExp(/^http(s){0,1}:\/\/www(\.){1,1}[a-zA-Z0-9\-_?#]{1,}(\.){1,1}[a-zA-Z]{2,}$/);
let url = undefined;

browserSync.init({ server: true });

process.argv.forEach(function (val, idx, arr) {   
    if(urlPattern.test(val)) {
        url = val;
        return;
    }
});

if(url === undefined) {
    try {
        throw new Error('Chowabunga! Url is not valid... let´s take a pizza!');
    } catch (e) {
        console.log( e.name, e.message);
    }
}

// get the PageSpeed Insights report 
psi(url).then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
});
 
// output a formatted report to the terminal 
psi.output(url).then(() => {
  console.log('done');
});
 
// Supply options to PSI and get back speed and usability scores 
psi(url, {nokey: 'true', strategy: 'mobile'}).then(data => {
  console.log('Speed score: ' + data.ruleGroups.SPEED.score);
  console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
});