import sqlite3 from 'sqlite3';
const sqldb = new sqlite3.Database('./store.db');

function RegisterCharacter(character, discord, name) {
    var stmt = sqldb.prepare('INSERT INTO characters VALUES(?, ?, ?)');
    stmt.run(character, discord, name);
    stmt.finalize();
}

export {RegisterCharacter};

function GetCharacters(discord) {
    var characters = [];
    sqldb.each("SELECT character_id, character_name FROM characters WHERE discord_id = " + discord, function(err, row) {
        characters.push({
            character_id: row.character_id,
            character_name: row.character_name,
        });
    });
    return characters;
}

process.on('exit', function() {
    sqldb.close();
});
