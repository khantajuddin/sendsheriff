import Replicate from "replicate";

interface RequestBody {
  url: string;
  question: string;
}

const replicate = new Replicate({
    // auth: process.env.REPLICATE_API_TOKEN as string,
    auth: "r8_TiBjEckqmtPATFA51YnErYFSx8FKlKE0r5vAp"
  });

export async function POST(request: Request) {
try {
  const body: RequestBody = await request.json();
    const { url, question } = body;

    const output = await replicate.run(
      "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608",
      {
        input: {
          image: url,
          question: question
        }
      }
    );

    return new Response(JSON.stringify({ response: output}), {
      status: 200
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "An error occurred while processing the request." }), {
      status: 500
    });
  }
}