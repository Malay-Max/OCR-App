const Database = require('better-sqlite3');
const db = new Database('./dev.db');

console.log('Authors:', db.prepare('SELECT COUNT(*) as count FROM Author').get());
console.log('Works:', db.prepare('SELECT COUNT(*) as count FROM Work').get());

const authors = db.prepare('SELECT * FROM Author').all();
const works = db.prepare('SELECT * FROM Work').all();

console.log('\nAll Authors:', authors);
console.log('\nAll Works:', works);

db.close();
