import {Command} from 'commander'
import { shortenURL } from './shortener.js';

const program = new Command();

interface urlPairs {
    url: string,
    tinyUrl: string,
    id: number
}

let urlList: urlPairs[] = [];

program
    .name('URL Shortener')
    .description('A URL Shortener CLI')
    .version('1.0.0');

program
    .command('shorten <url>')
    .description('Takes in a URL to shorten and save to history')
    .action(async (url: string) => {
        try {
            let urlExists = false;
            for (let i = 0; i < urlList.length; ++i) {
                if (url === urlList[i]?.url) {
                    console.log(`Shortened URL: ${urlList[i]?.tinyUrl}`);
                    urlExists = true;
                    break;
                }
            }

            if (!urlExists) {
                const result = await shortenURL(url);
                let urlPair: urlPairs = {url: url, tinyUrl: result, id: (urlList.length + 1)};
                urlList.push(urlPair);
                console.log(`Shortened URL: ${result}`);
            }

        } catch (err) {
            console.log(`Error: ${err instanceof Error ? err.message : err}`);
            process.exit(1);
        }
    });

program
    .command('list')
    .description('Outputs a list of URLs shortened')
    .action(async () => {
        if (urlList.length <= 0) {
            console.log('No shortened URLs. Try shortening some')
        } else {
            for (let i = 0; i < urlList.length; ++i) {
                console.log(`URL: ${urlList[i]?.url} | Shortened: ${urlList[i]?.tinyUrl} | ID: ${urlList[i]?.id}`);
            }
        }
    });
    
program.parse();