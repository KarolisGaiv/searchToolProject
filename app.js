const path = require('path')
const puppeteer = require('puppeteer');

(async () => {
    try {

        // **Basic Puppeteer launch with direction to website (use "headless: true" if you don't want Chromium tab to popup)
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1400,
            height: 1100,
            deviceScaleFactor: 1
        });
        await page.goto('https://www.pathofexile.com/trade/search/Harvest', { waitUntil: 'networkidle0' });

        const itemSelector = '#trade > div.top > div.search-panel > div.search-bar.search-advanced > div > div.search-advanced-pane.blue > div:nth-child(1) > div.filter-group-body > div:nth-child(1) > span > div.multiselect.filter-select > div.multiselect__tags > input';
        const searchButton = '#trade > div.top > div.controls > div.controls-center > button';
        const filterLoader = '#trade > div.top > div.controls > div.controls-right > button.btn.toggle-search-btn > span:nth-child(2)';

        await page.click(itemSelector);

        // **Hard coded value "Boots" to look for in the website 
        await page.keyboard.type('Boots');
        await page.keyboard.press('Enter');

        await page.click(searchButton);

        // **After search engine starts, Puppeteer waits for the website to load item names. Without this line code would not work. Not sure though if there is a difference which nodes Puppeteer should wait for to be loaded.
        await page
            .waitForSelector('.resultset > div[class="row"]')
            .then(() => page.evaluate(() => {
                const itemRow = [];
                const itemNodeList = document.querySelectorAll('.resultset > div[class="row"] > div[class="middle"]'
                );

                const itemArray = Array.from(itemNodeList);
                console.log(itemArray);

                // itemNodeList.forEach(item => {
                //     const itemInfo = item.getElementsByClassName('itemHeader');
                //     console.log(itemInfo);
                // });
             })
            )
            .catch(() => console.log('Selector Error'));

        // await browser.close();

    } catch (e) {
        console.log('our error', e);
    }
})();