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
    
program.parse();