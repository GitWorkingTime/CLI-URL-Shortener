import Database from "better-sqlite3"
const db = new Database("./database/data.db");

const table: string = "CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, shortened TEXT NOT NULL UNIQUE)";
db.exec(table);

interface UrlRow {
    id: number,
    url: string,
    shortened: string,
}

export function insertData(url: string, shortened: string) {
    const insert: string = "INSERT INTO urls(url, shortened) VALUES (?, ?)";
    db.prepare(insert).run(url, shortened);
}

export function fetchAll(): UrlRow[] | undefined {
    const rows = db.prepare('SELECT * FROM urls').all() as UrlRow[];
    if (rows.length <= 0) {
        return undefined;
    }
    return rows;
}

export function deleteRow(id: number): UrlRow | undefined {
    let deletedRow = db.prepare('SELECT * FROM urls WHERE id = ?').get(id) as UrlRow | undefined;
    if (!deletedRow) {
        return undefined;
    }

    db.prepare('DELETE FROM urls WHERE id = ?').run(id);
    return deletedRow;
}

export function resetTable() {
    const drop = "DROP TABLE IF EXISTS urls";
    db.exec(drop);

    const table: string = "CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, shortened TEXT NOT NULL UNIQUE)";
    db.exec(table);
}