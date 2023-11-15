import AWS from 'aws-sdk';
import https from 'https';
import fs from 'fs';

// Configure the AWS SDK with your credentials
const rekognition = new AWS.Rekognition({
    accessKeyId: 'AKIA4THCW6FJVOEMUZOO',
    secretAccessKey: 'EViByjcF88LopsZlCbUEenIn5TH8j6weMLb2pTx0',
    region: 'us-west-2'
});

type RequestBody = {
    url: string;
};

async function detectImageProperties(imagePath: string) {
    const imageBytes = fs.readFileSync(imagePath);

    const params = {
        Image: {
            Bytes: imageBytes
        },
        Features: ["IMAGE_PROPERTIES"]
    };

    try {
        const response = await rekognition.detectLabels(params).promise();
        return response;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

async function downloadImage(url: string, imageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(imageName);
        https.get(url, (response: { pipe: (arg0: any) => void; }) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        }).on('error', (err: any) => {
            fs.unlink(imageName, () => reject(err));
        });
    });
}

export async function POST(request: Request) {
    try {
        const { url }: RequestBody = await request.json();
        const imageName = "test.jpg";

        // Download the image
        await downloadImage(url, imageName);

        // Detect image properties
        const response = await detectImageProperties(imageName);
        console.log(response);

        // Delete the temporary image file
        //fs.unlinkSync(imageName);

        return new Response(JSON.stringify({ response }), {
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
