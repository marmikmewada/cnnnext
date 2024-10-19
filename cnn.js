const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const urls = [
        'https://edition.cnn.com/us',
        'https://edition.cnn.com/world',
        'https://edition.cnn.com/politics',
        'https://edition.cnn.com/business',
        'https://edition.cnn.com/health',
        'https://edition.cnn.com/entertainment',
        'https://edition.cnn.com/style',
        'https://edition.cnn.com/travel',
        'https://edition.cnn.com/sports',
        'https://edition.cnn.com/science',
        'https://edition.cnn.com/climate',
        'https://edition.cnn.com/weather',
        'https://edition.cnn.com/world/europe/ukraine',
        'https://edition.cnn.com/world/middleeast/israel'
    ];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const articles = [];

    for (const url of urls) {
        await page.goto(url);

        // Wait for the main content to load
        await page.waitForSelector('section.layout__wrapper');

        // Extract article data
        const extractedArticles = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.card'));
            return items.map(item => {
                const title = item.querySelector('.container__headline-text')?.innerText || '';
                const link = item.querySelector('a.container__link')?.href || '';
                const img = item.querySelector('img') ? item.querySelector('img').src : null;

                // Only return articles with a valid image
                return img ? { title, link, img } : null;
            }).filter(article => article);
        });

        articles.push(...extractedArticles);
    }

    console.log('Extracted Articles:', articles);

    // Define the path for the JSON file
    const filePath = path.join(__dirname, 'cnn.json');

    // Write the articles to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf-8');

    await browser.close();
})();
