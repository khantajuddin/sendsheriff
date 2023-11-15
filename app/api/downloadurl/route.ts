import puppeteer from "puppeteer";
import fs from 'fs';

type RequestBody = {
    url: string;
};

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { url } = body;

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
          
            // Navigate to the webpage
            await page.goto(url, { waitUntil: 'networkidle2' });
          
            // Get the HTML content
            const htmlContent = await page.content();
          
            // Save HTML content to a local file
           // const outputFilePath = `public/preview.html`;
            const outputFilePath = `/tmp/preview.html`;
            const outputDirectory = `/tmp`;
            
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory);
            }
            fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
          
            console.log(`HTML saved to: ${outputFilePath}`);
          
            // Close the browser
            await browser.close();
          

        return new Response(JSON.stringify({ url: "preview.html"}), {
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


