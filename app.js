const puppeteer = require("puppeteer");

const getItems = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1400,
    height: 1100,
    deviceScaleFactor: 1,
  });

  await page.goto("https://www.pathofexile.com/trade/search/Harvest", {waitUntil: "networkidle0",});

  const itemSelector =
    "#trade > div.top > div.search-panel > div.search-bar.search-advanced > div > div.search-advanced-pane.blue > div:nth-child(1) > div.filter-group-body > div:nth-child(1) > span > div.multiselect.filter-select > div.multiselect__tags > input";

  const itemRarity =
    "#trade > div.top > div.search-panel > div.search-bar.search-advanced > div > div.search-advanced-pane.blue > div.filter-group.expanded > div.filter-group-body > div:nth-child(2) > span > div.multiselect.filter-select > div.multiselect__tags > input";

  const searchButton =
    "#trade > div.top > div.controls > div.controls-center > button";

  const filterLoader =
    "#trade > div.top > div.controls > div.controls-right > button.btn.toggle-search-btn > span:nth-child(2)";

  // **Hard coded value "Boots" to look for in the website
  await page.click(itemSelector);
  await page.keyboard.type("Boots");
  await page.keyboard.press("Enter");

  // Hard coded value of "RARE item type to look for in the website
  await page.click(itemRarity);
  await page.keyboard.type("Rare");
  await page.keyboard.press("Enter");

  await page.click(searchButton);

  // **After search engine starts, Puppeteer waits for the website to load item names.
  const itemList = await page
    .waitForSelector('.resultset > div[class="row"]')
    .then(() =>
      page.evaluate(() => {
        const itemArray = [];

        // Create NodeList of items with specific selector
        const itemNodeList = document.querySelectorAll(
          '.resultset > div[class="row"] > div[class="middle"] > div[class="itemPopupContainer newItemPopup rarePopup"] > div[class="itemBoxContent"]'
        );

        // Loop through every item in the NodeList and for each item take values of itemName and itemInfo
        itemNodeList.forEach((item) => {
          const itemName = item.getElementsByClassName("itemHeader doubleLine")[0].innerText;
          const itemInfo = item.getElementsByClassName("content")[0].innerText;
          
        // Push every item into previously created array from NodeList by creating objects with item name and it's information
          itemArray.push({ itemName, itemInfo });
        });
        return itemArray;
      })
    )
    .catch(() => console.log("Selector Error"));

  return itemList;
};

const startScrapper = async () => {
  const items = await getItems();
  console.log(items);
};

startScrapper();