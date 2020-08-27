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
        const itemRarity = '#trade > div.top > div.search-panel > div.search-bar.search-advanced > div > div.search-advanced-pane.blue > div.filter-group.expanded > div.filter-group-body > div:nth-child(2) > span > div.multiselect.filter-select > div.multiselect__tags > input'
        const searchButton = '#trade > div.top > div.controls > div.controls-center > button';
        const filterLoader = '#trade > div.top > div.controls > div.controls-right > button.btn.toggle-search-btn > span:nth-child(2)';

        // **Hard coded value "Boots" to look for in the website 
        await page.click(itemSelector);
        await page.keyboard.type('Boots');
        await page.keyboard.press('Enter');

        // Hard coded value of "RARE item type to look for in the website
        await page.click(itemRarity);
        await page.keyboard.type('Rare');
        await page.keyboard.press('Enter');

        await page.click(searchButton);

        // **After search engine starts, Puppeteer waits for the website to load item names. Without this line code would not work. Not sure though if there is a difference which nodes Puppeteer should wait for to be loaded.
        await page
            .waitForSelector('.resultset > div[class="row"]')
            .then(() => page.evaluate(() => {
                const itemRow = [];
                const itemNodeList = document.querySelectorAll('.resultset > div[class="row"] > div[class="middle"] > div[class="itemPopupContainer newItemPopup rarePopup"] > div[class="itemBoxContent"]');

                // Convert NodeList to regular array
                const itemArray = Array.from(itemNodeList);

                // Print each item in array in plain text format
                // for (item in itemArray) {
                //     console.log(itemArray[item].innerText);
                // }

                // Prints each item in plain text in array
                for (item in itemArray) {
                    const textItem = itemArray[item].innerText;
                    itemRow.push(textItem);
                };
                console.log(itemRow);
             })
            )
            .catch(() => console.log('Selector Error'));
    } catch (e) {
        console.log('our error', e);
    }
})();