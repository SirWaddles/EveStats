import fetch from 'node-fetch';
import Discord from 'discord.js';
import approx from 'approximate-number';
import {GetModulePrices} from './prices';
import {GetCharacters} from './dbstore';
import {GetSkillList} from './skills';

function GetDroneDPS(dronelist) {
    if (dronelist.length <= 0) return 0;
    return Math.max.apply(Math, dronelist.map(v => v.dps));
}

function GetRequiredSkills(skillfit, skills) {
    return skillfit.filter(v => skills.filter(s => v.id == s.skill_id && s.current_skill_level >= v.level).length == 0);
}

function EFTFitStats(message) {
    var data = message.content;
    data = data.replace("```\n[", "[");
    data = data.replace("```", "");
    var fetchpr = fetch("http://localhost:8000", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data,
        method: "POST",
    }).then(r => r.json());

    var characters = GetCharacters(message.author.id).then(GetSkillList);
    var prs = [fetchpr, characters];

    return Promise.all(prs).then(function(prdata) {
        var data = prdata[0];
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
        StatsEmbed.addField('Drone DPS', Math.floor(GetDroneDPS(data.dronelist)), true);
        StatsEmbed.addField('Cost', approx(GetModulePrices(data.modules)));

        var msgcontent = '';
        if (prdata.length > 1) {
            var skills = GetRequiredSkills(data.skills, prdata[1]);
            msgcontent = skills.slice(0,5).map(v => "**" + v.skill + "**: " + v.level).join("\n");
        }

        message.channel.send(msgcontent, {
            embed: StatsEmbed
        });
    }).catch(function(e) {
        console.log(e);
    });
}

export {EFTFitStats};
