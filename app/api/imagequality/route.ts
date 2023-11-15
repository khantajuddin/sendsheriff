
import sharp from "sharp";
import Jimp from "jimp";

type RequestBody = {
    url: string;
};

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { url } = body;

        const dataURI = await new Promise<string>((resolve, reject) => {
            Jimp.read(url, (err: any, image: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                const sharpness = calculateSharpness(image);
                console.log('Sharpness:', sharpness);
            
                // Calculate image blurriness
                const blurriness = calculateBlurriness(image);
                console.log('Blurriness:', blurriness);
                
                image.getBufferAsync(Jimp.AUTO).then((uri: string) => {
                    resolve(uri);
                }).catch((error: any) => {
                    reject(error);
                });
            });
        });


        return new Response(JSON.stringify({ isBlurry: true }), {
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


// Function to calculate image sharpness
function calculateSharpness(image) {
    // Use a simple edge detection algorithm to calculate sharpness
    const sharpness = image.convolute([
        [-1, -1, -1],
        [-1, 9, -1],
        [-1, -1, -1],
    ]);

    // Calculate the average pixel value of the sharpness image
    const averageSharpness = Jimp.intToRGBA(
        Jimp.rgbaToInt(
            sharpness.bitmap.data[0],
            sharpness.bitmap.data[1],
            sharpness.bitmap.data[2],
            sharpness.bitmap.data[3]
        )
    );

    // The averageSharpness will be higher for sharper images
    return (averageSharpness.r + averageSharpness.g + averageSharpness.b) / 3;
}

// Function to calculate image blurriness
function calculateBlurriness(image) {
    // Use the image hash method to calculate blurriness
    const hash = image.hash();

    // The hash value will be lower for blurrier images
    return hash;
}