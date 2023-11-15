import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

type RequestBody = {
    url: string;
};


  
export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { url } = body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        let hasNagativeMargin = false;
        let hasOverlapping = false;
  await page.goto(url);

  // Get the rendered widths of all elements (excluding html, head, body, style, br)
  const elementsToCheck = await page.$$('*:not(html, head, body, style, br)');

  for (const elementHandle of elementsToCheck) {
    const elementDescription = await page.evaluate(el => el.outerHTML, elementHandle);
    const elementWidth = await page.evaluate(el => el.offsetWidth, elementHandle);
    const parentWidth = await page.evaluate(el => el.parentElement.offsetWidth, elementHandle);

    // Check if element has width greater than its parent's width
    if (elementWidth > parentWidth) {
        hasOverlapping = true;
      console.log(`Element '${elementDescription}' has width greater than its parent's width.`);
    }

    // Check if element has negative margin or position values
    const styles = await page.evaluate(el => {
      return {
        marginTop: getComputedStyle(el).marginTop,
        marginRight: getComputedStyle(el).marginRight,
        marginBottom: getComputedStyle(el).marginBottom,
        marginLeft: getComputedStyle(el).marginLeft,
        top: getComputedStyle(el).top,
        right: getComputedStyle(el).right,
        bottom: getComputedStyle(el).bottom,
        left: getComputedStyle(el).left,
      };
    }, elementHandle);

    const marginValues = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    const positionValues = ['top', 'right', 'bottom', 'left'];

    for (const property of marginValues.concat(positionValues)) {
      const value = parseInt(styles[property]);
      if (!isNaN(value) && value < 0) {
        console.log(`Element '${elementDescription}' has negative ${property}.`);
        hasNagativeMargin = true;
        break;
      }
    }
  }

  // Close the browser
  await browser.close();


        return new Response(JSON.stringify({ hasNagativeMargin, hasOverlapping }), {
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


