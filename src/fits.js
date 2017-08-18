import fetch from 'node-fetch';
import Discord from 'discord.js';
import approx from 'approximate-number';

function EFTFitStats(message) {
    var data = message.content;
    data = data.replace("```\n[", "[");
    data = data.replace("```", "");
    fetch("http://localhost:8000", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data,
        method: "POST",
    }).then(r => r.json()).then(function(data) {
        var StatsEmbed = new Discord.RichEmbed();
        var ehp = data.ehp.armor + data.ehp.hull + data.ehp.shield;
        StatsEmbed.setColor('AQUA');
        StatsEmbed.title = data.fitname;
        StatsEmbed.setThumbnail("https://eve.genj.io/imgs/renders/" + data.shipid + ".png");
        StatsEmbed.addField('Ship', data.shipname, true);
        StatsEmbed.addField('Max Velocity', Math.floor(data.speed), true);
        StatsEmbed.addField('EHP', approx(ehp), true);
        StatsEmbed.addField('EHP/s', Math.floor(Math.max(data.tank.armorRepair, data.tank.shieldRepair, data.tank.passiveShield)), true);
        StatsEmbed.addField('Weapon DPS', Math.floor(data.weaponDPS), true);
        StatsEmbed.addField('Drone DPS', Math.floor(data.droneDPS), true);

        message.reply('', {
            embed: StatsEmbed
        });
    });
}

export {EFTFitStats};
