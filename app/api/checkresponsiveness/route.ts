import puppeteer from "puppeteer";
import path from 'path';

type RequestBody = {
    url: string;
};

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { url } = body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Set viewport to emulate a mobile device
        await page.setViewport({
          width: 375, // iPhone width
          height: 667, // iPhone height
          isMobile: true,
          hasTouch: true,
        });
      
        await page.goto(url);
        // Capture screenshots at different breakpoints
        const breakpoints = [375, 768, 1024]; // Add more breakpoints as needed
        let isResponsive = true;
        const screenshots: string[] = [];
        for (const width of breakpoints) {
          await page.setViewport({ width, height: 800 }); // Adjust height as needed
          const screenshotPath = path.join('public', `/screenshot_${width}.png`);
          await page.screenshot({ path: screenshotPath,  fullPage: true  });
          screenshots.push(`screenshot_${width}.png`);
          const elementsToCheck = await page.$$('*:not(html, head, body, style, br)');
            for (const elementHandle of elementsToCheck) {
            const elementDescription = await page.evaluate((el: { outerHTML: any; }) => el.outerHTML, elementHandle);
            const elementWidth = await page.evaluate((el: { offsetWidth: any; }) => el.offsetWidth, elementHandle);
        
            // Check if element has width greater than viewport width
            if (elementWidth > width) {
                isResponsive = false;
                console.log(`Element '${elementDescription}' has width greater than viewport width.`);
            }
            }
        }
        const links = await page.evaluate(() => {
            // Use the Puppeteer function to query for links
            const anchors = Array.from(document.querySelectorAll('a'));
            
            // Extract href attributes
            return anchors.map(anchor => anchor.href);
          });
          
        await browser.close();
        return new Response(JSON.stringify({ isResponsive, screenshots, links}), {
            status: 200,
        });
    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({
                error: "An error occurred while processing the request.",
            }),
            {
                status: 500,
            }
        );
    }
}


