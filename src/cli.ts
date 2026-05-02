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
    .description('A URL Shortener CLI')
    .version('1.0.0');

program
    .command('shorten <url>')
    .description('Takes in a URL to shorten and save to history')
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
    .description('Outputs a list of shortened URLs')
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
    .command('delete <id>')
    .description('Removes a shortened URL given an ID number')
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
    })

program.parse();