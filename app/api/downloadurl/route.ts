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

        // Generate a unique filename (you can use a hash or timestamp)
        const uniqueFilename = `preview_${Date.now()}.html`;

        // Save HTML content to the public directory with the unique filename
        const outputFilePath = `public/${uniqueFilename}`;
        fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');

        console.log(`HTML saved to: ${outputFilePath}`);

        // Close the browser
        await browser.close();

        return new Response(JSON.stringify({ url: uniqueFilename }), {
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