# meteor-statify
For turning csr (client side rendered) meteor.js websites into static webpages.

# Prerequisites
It would be prefered for your website to have as little client-side code as possible. You can (obviously) insert the javascript manually afterwards, but any javascript code that the website would trigger upon load (animations, event listeners, etc.) won't work out of the box.

You need [Phantomjs](http://phantomjs.org) for this to work. It was tested with Phantomjs v2.0.0 on Mac OSX Yosemite; if you have a different version of Phantomjs or use a different OS, I have no guarantee that it will work.

# Use

To get started, clone this repository:
```bash
git clone https://github.com/Danappelxx/meteor-statify.git
```

Afterwards, execute the script with the following command:
```bash
phantomjs statify.js '<website url>'
```

The script will (hopefully) log a bunch of success statements. In the end the directory structure will be as such:
.
|__ result
|   |__ index.html
|   |__ style.css
|__ statify.js

Then, upon opening index.html, you should see a (slightly more basic) version of your original meteor website. You can then edit the index.html by hand and paste in any javascript that you actually wanted.

# Known Issues
* ssl (https) urls don't work. This seems to be an issue with Phantomjs itself.
* Images don't get downloaded. Unfortunately Phantomjs doesn't support file downloading so you'll have to do this manually. If you have relative urls, it should be as easy as copy & pasting the files into your new directory.
* The script tags are still there and throwing errors in the console. I haven't gotten around to removing the script tags yet.
