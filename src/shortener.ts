import dotenv from 'dotenv'
dotenv.config({quiet: true});

const token = process.env.TINYURL;
if (token == undefined) {
    throw new Error ("TINYURL API token is not found in .env!");
}

interface TinyUrlSuccess {
    code: 0,
    data: {
        tiny_url: string,
        url: string,
        alias: string
    },
    errors: [],
};

interface TinyUrlError {
    code: number,
    data: [] | unknown,
    errors: string[],
};

type TinyUrlResponse = TinyUrlSuccess | TinyUrlError;

// Runtime type gaurd
function isTinyUrlSuccess(body: unknown): body is TinyUrlSuccess {
  if (typeof body !== 'object' || body === null) return false;

  if (!('code' in body) || body.code !== 0) return false;

  if (!('data' in body) || typeof body.data !== 'object' || body.data === null) {
    return false;
  }

  if (!('tiny_url' in body.data) || typeof body.data.tiny_url !== 'string') {
    return false;
  }

  return true;
}

export async function shortenURL(url: string): Promise<string>{
    const res = await fetch(`https://api.tinyurl.com/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Accept': 'application/json' 
        },
        body: JSON.stringify({url})
    });

    if (!res.ok) {
        throw new Error (`HTTP ${res.status}: ${res.statusText}`)
    }

    const content = await res.json() as TinyUrlResponse;

    if(!isTinyUrlSuccess(content)) {
        throw new Error (`${content.errors.join(', ')}`);
    }

    return content.data.tiny_url;
}