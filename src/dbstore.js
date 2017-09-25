import sqlite3 from 'sqlite3';
const sqldb = new sqlite3.Database('./store.db');

function RegisterCharacter(character, discord, name, access_token, refresh_token, expires) {
    var stmt = sqldb.prepare('REPLACE INTO characters VALUES(?, ?, ?, ?, ?, ?)');
    stmt.run(character, discord, name, access_token, refresh_token, expires);
    stmt.finalize();
}

export {RegisterCharacter};

function GetAllCharacters(discord) {
    return new Promise((resolve, reject) => {
        sqldb.all("SELECT character_id, discord_id, character_name, access_token, refresh_token, expires FROM characters WHERE discord_id = ?", discord,
        function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row);
        });
    });
}

function GetCharacters(discord) {
    return GetAllCharacters(discord).then(v => v[0]);
}

export {GetCharacters, GetAllCharacters};

function GetCharacterByName(character_name) {
    return new Promise((resolve, reject) => {
        sqldb.all("SELECT character_id, discord_id, character_name, access_token, refresh_token, expires FROM characters WHERE character_name = ?", character_name,
        function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row[0]);
        });
    });
}

export {GetCharacterByName};

function CreateJimmyKey(discord_id, key) {
    var stmt = sqldb.prepare('INSERT INTO jimmy_keys (discord_id, key) VALUES(?, ?)');
    stmt.run(discord_id, key);
    stmt.finalize();
}

function GetJimmyKey(discord_id) {
    return new Promise((resolve, reject) => {
        sqldb.all("SELECT key FROM jimmy_keys WHERE discord_id = ?", discord_id, function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row[0]);
        });
    });
}

function GetJimmyOwner(key) {
    return new Promise((resolve, reject) => {
        sqldb.all("SELECT discord_id FROM jimmy_keys WHERE key = ?", key, function(err, row) {
            if (row.length <= 0) {
                reject();
                return;
            }
            resolve(row[0]);
        });
    });
}

export {CreateJimmyKey, GetJimmyKey, GetJimmyOwner};

process.on('exit', function() {
    sqldb.close();
});
