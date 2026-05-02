import {Command} from 'commander'
import { shortenURL } from './shortener.js';
import * as db from './db.js'

const program = new Command();

let urlHash: Map<string, {shortened: string, id: number}> = new Map();
let urlID: Map<number, string> = new Map();

function updateList(): void;
function updateList() {
    let urls = db.fetchAll();
    if (urls !== undefined) {
        urls.forEach((url) => {
            if (url !== undefined) {
                if (urlHash.get(url.url) === undefined) {
                    urlHash.set(url.url, {shortened: url.shortened, id: url.id});
                    urlID.set(url.id, url.url);
                }
            }
        })
    }
}

updateList();

program
    .name('URL Shortener')
    .description('A CLI for shortening URLs using TinyURL API, with local history.')
    .version('1.0.0');

program
    .command('shorten')
    .summary('shortnens a URL')
    .description('Shorten a URL via TinyURL and saves it to a local history. If the URL\nhas already been shortened, returns the existing entry instead of making\na new URL.')
    .argument('<url>', 'the URL to shorten')
    .addHelpText('after', '\nExample:\nnpm start -- shorten http://example.com\nTiny Url: https://tinyur1.com/abc123\n')
    .action(async (url: string) => {
        try {
            if(urlHash.get(url) === undefined ) {
                let compressed = await shortenURL(url);
                db.insertData(url, compressed);
                console.log(`Tiny URL: ${compressed}`);
            } else {
                console.log(`Tiny URL: ${urlHash.get(url)?.shortened}`);
            }

        } catch (err) {
            console.log(`Error: ${err instanceof Error ? err.message : err}`);
            process.exit(1);
        }
    });

program
    .command('list')
    .summary('Lists all shortened URLs')
    .description('Displays all shortened URLs from local history indexed with their IDs')
    .action(async () => {
        if (urlHash.size === 0) {
            console.log('No URLs are shortened. Try using the shorten <url> command to add urls');
        } else {
            urlHash.forEach((value, key) => {
                console.log(`[ID: ${value.id}] | Url: ${key} || Shortened: ${value.shortened}`);
            })
        }
    })

program
    .command('delete')
    .summary('Removes a shortened URL from local history')
    .description('Removes a shortened URL via an ID number')
    .argument('<id>', 'the associated ID number with a shortened url, as seen via the list command')
    .addHelpText('after', '\nExample:\nnpm start -- delete 1\nThis url (http://example.com) and it\'s associated shortened url is now removed\n')
    .action(async (idStr: string) => {
        const id = parseInt(idStr, 10);
        let url = urlID.get(id);
        if (url === undefined) {
            console.log(`ID does not exist! Use list to find your urls`);
        } else {
            db.deleteRow(id);
            console.log(`This url (${url}) and it's associated shortened url is now removed`);
        }
    })

program
    .command('reset')
    .description('Clears all data')
    .action(async () => {
        db.resetTable();
        console.log('All data has been cleared!');
    })

program.parse();