const psi = require('psi');
const browserSync = require('browser-sync').create();
const urlPattern = new RegExp(/^http(s){0,1}:\/\/www(\.){1,1}[a-zA-Z0-9\-_?#]{1,}(\.){1,1}[a-zA-Z]{2,}$/);
const serverPattern = new RegExp(/^--server=(true|false)$/);
const tunnelPattern = new RegExp(/^--tunnel=(true|false)$/);
const pathPattern = new RegExp(/^--path=[a-zA-Z0-9\/_]{1,}$/);

var options = {
    tunnel: false,
    server: false,
    url: undefined
};

process.argv.forEach(function (val, idx, arr) {
    if (urlPattern.test(val)) {
        options.url = val;
    }

    if(serverPattern.test(val)) {
        options.server = new RegExp(/true$/).test(val);
    }

    if(tunnelPattern.test(val)) {
        options.tunnel = new RegExp(/true$/).test(val);
    }

    if(pathPattern.test(val)) {
        options.url = val.match(new RegExp(/=[a-zA-Z0-9\/_]{1,}/))[0].substring(1);
    }
});

if (options.url === undefined) {
    try {
        throw new Error('Chowabunga! Url|Path is not valid... let´s take a pizza!');
    } catch (e) {
        console.log(e.name, e.message);
        process.exit();
    }
}

if(options.server === true && options.tunnel === true) {
    browserSync.init({ server: options.url, tunnel: options.tunnel }, function () {
        console.log(browserSync.instance.tunnel.url);
        var url = browserSync.instance.tunnel.url;

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
} else {
    // get the PageSpeed Insights report 
    psi(options.url).then(data => {
        console.log(data.ruleGroups.SPEED.score);
        console.log(data.pageStats);
    });

    // output a formatted report to the terminal 
    psi.output(options.url).then(() => {
        console.log('done');
    });

    // Supply options to PSI and get back speed and usability scores 
    psi(options.url, { nokey: 'true', strategy: 'mobile' }).then(data => {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
        console.log('');
        console.log('Done speeding... let´s "Shredder" the server!');
        
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
}

