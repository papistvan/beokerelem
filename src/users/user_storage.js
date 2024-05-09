import sqlite3 from 'sqlite3'


export async function connectToSqlite(filepath, callback) {
    const db = new sqlite3.Database(filepath, err => {
        callback(err, {
            
        })
    })
}
