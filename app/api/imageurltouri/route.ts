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
                
                image.getBase64Async(Jimp.AUTO).then((uri: string) => {
                    resolve(uri);
                }).catch((error: any) => {
                    reject(error);
                });
            });
        });

        return new Response(JSON.stringify({ imageURI: dataURI }), {
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
