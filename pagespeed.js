const psi = require('psi');
const browserSync = require('browser-sync').create();
// const urlPattern = new RegExp(/^http(s){0,1}:\/\/www(\.){1,1}[a-zA-Z0-9\-_?#]{1,}(\.){1,1}[a-zA-Z]{2,}$/);
// var url = undefined;

// process.argv.forEach(function (val, idx, arr) {
//     if (urlPattern.test(val)) {
//         url = val;
//         return;
//     }
// });

// if (url === undefined) {
//     try {
//         throw new Error('Chowabunga! Url is not valid... let´s take a pizza!');
//     } catch (e) {
//         console.log(e.name, e.message);
//     }
// }

browserSync.init({ server: 'test', tunnel: true }, function () {
    console.log(browserSync.instance.tunnel.url);
    var url = browserSync.instance.tunnel.url;

    // setTimeout(function () {
    //     console.log('Server stopped and has been "Shredder"-ed');
    //     browserSync.exit();
    // }, 5000);

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
    psi(url, { nokey: 'true', strategy: 'mobile' }).then(data => {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
        console.log('');
        console.log('Done speeding... let´s "Shredder" the server!');
        browserSync.exit();
        
        var turtleScore = 0,
            shredderScore = 0;

        if(data.ruleGroups.SPEED.score > 80)
        {
            turtleScore++;
        } else {
            shredderScore++;
        }
        
        if(data.ruleGroups.USABILITY.score > 80)
        {
            turtleScore++;
        } else {
            shredderScore++;
        }

        console.log('Winner: ' + (turtleScore > shredderScore ? ' Turtles!!!' : 'Shredder...'));
        process.exit();
    });
});
