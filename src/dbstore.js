import sqlite3 from 'sqlite3';
const sqldb = new sqlite3.Database('./store.db');

function RegisterCharacter(character, discord, name, access_token, refresh_token) {
    var stmt = sqldb.prepare('REPLACE INTO characters VALUES(?, ?, ?, ?, ?)');
    stmt.run(character, discord, name, access_token, refresh_token);
    stmt.finalize();
}

export {RegisterCharacter};

function GetCharacters(discord) {
    return new Promise((resolve, reject) => {
        sqldb.all("SELECT character_id, character_name, access_token, refresh_token FROM characters WHERE discord_id = \"" + discord + "\"",
        function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row[0]);
        });
    });
}

export {GetCharacters};

process.on('exit', function() {
    sqldb.close();
});
