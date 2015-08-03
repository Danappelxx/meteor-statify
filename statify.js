var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');

// improve debugging
page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};

// check for arguments
if (system.args.length === 1) {
    console.log('Usage: statify.js <some URL>');
    phantom.exit();
}

var htmlLoadingTime = Date.now();

// get first argument
var address = system.args[1];

console.log('Loading address: ' + address + '...');

// load base url
page.open(address, function(status) {

    if (status !== 'success') {
        console.log('Failed loading the base html page. Reason: ' + page.reason);

        phantom.exit();
        return;
    }

    // see how long it took
    htmlLoadingTime = Date.now() - htmlLoadingTime;
    console.log('Loaded base html page! loading time: ' + htmlLoadingTime + 'ms');

    var baseContent = page.content;



    // get css url
    console.log('Searching for css tag...');

    // create regex
    var cssUrlRegex = /<link rel="stylesheet" type="text\/css" .* href="\/(.*?\.css\?meteor_css_resource=true)">/;

    // match regex
    var baseCssUrl = baseContent.match(cssUrlRegex)[1];

    // add css url to the base url
    var cssUrl = address + baseCssUrl;
    console.log('Found css!');
    console.log('Css url: ' + cssUrl);

    // remove old css tag from page
    baseContent = baseContent.replace(cssUrlRegex, "<link rel='stylesheet' type='text/css' href='style.css'>");
    console.log('Replaced old css url with url.');


    // give them some info
    var cssLoadingTime = Date.now();

    console.log('Loading css...');

    // load css
    page.open(cssUrl, function (status) {

        if (status !== 'success') {
            console.log('Failed loading the css. Reason: ' + page.reason);

            phantom.exit();
            return;
        }

        cssLoadingTime = Date.now() - cssLoadingTime;
        console.log('Loaded! loading time: ' + cssLoadingTime + 'ms');

        var css = page.plainText;

        // write base html to file
        console.log('Writing base page content to result/index.html...');
        fs.write('result/index.html', baseContent, 'w');
        console.log('Written!');

        console.log('Writing css to result/style.css');
        fs.write('result/style.css', css, 'w');
        console.log('Written!');


        console.log('Done!');
        phantom.exit();


        // The below doesn't work because phantomjs doesn't support file downloads
        /*
        console.log('Searching for images...');

        var imgTagsRegex = /<img src=".*png" .*>/g;

        // get all html img tags
        var imgTags = baseContent.match(imgTagsRegex);
        console.log(imgTags);


        var imgUrlFromTagRegex = /<img.*src="([^"]*)".*>/;

        // get all image urls from img tags
        var baseImgUrls = imgTags.map( function (imgTag) {

            // get url
            var imgUrl = imgTag.match(imgUrlFromTagRegex)[1];

            return imgUrl;
        });

        var imgUrls = baseImgUrls.map( function (baseUrl) {
            return address + baseUrl;
        });

        console.log('img urls: ' + imgUrls);

        imgUrls.forEach( function (imgUrl, index, arr) {

            page.open(imgUrl, function (status) {

                if (status !== 'success') {
                    console.log('Failed loading the image. Reason: ' + page.reason);

                    phantom.exit();
                    return;
                }

                console.log('img: ' + page.content);


                if (index == arr.length - 1) {
                    console.log('last one');
                    phantom.exit();
                }
            });
        });
        */
    });
});
