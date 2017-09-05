import fetch from 'node-fetch';
import Discord from 'discord.js';
import approx from 'approximate-number';
import {GetModulePrices} from './prices';
import {GetCharacters} from './dbstore';
import {GetSkillList, GetSkillSP} from './skills';

function GetDroneDPS(dronelist) {
    if (dronelist.length <= 0) return 0;
    return Math.max.apply(Math, dronelist.map(v => v.dps));
}

function DeduplicateSkills(skills) {
    return skills.map(v => Object.assign(v, {level: Math.max.apply(Math, skills.filter(s => s.id === v.id).map(s => s.level))})).filter((v, idx, se) => idx == se.map(s => s.id).indexOf(v.id));
}

function GetRequiredSkills(skillfit, skills) {
    skillfit = skillfit.map(v => Object.assign(v, {
        current_level: skills.filter(s => s.skill_id == v.id).reduce((acc, a) => a.current_skill_level, 0),
    }));
    return DeduplicateSkills(skillfit.filter(v => skills.filter(s => v.id == s.skill_id && s.current_skill_level >= v.level).length == 0));
}

function EFTFitStats(message) {
    var data = message.content;
    data = data.replace("```\n[", "[");
    var lengthEnd = data.indexOf('```');
    if (lengthEnd === -1) return;

    var targetUser = message.author;
    if (message.mentions.users.size > 0) {
        targetUser = message.mentions.users.first();
    }

    data = data.substr(0, lengthEnd);
    var fetchpr = fetch("http://localhost:8000", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data,
        method: "POST",
    }).then(r => r.json());

    var characters = GetCharacters(targetUser.id).then(GetSkillList).catch(function(e) {
        return false;
    });
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
        var cost = GetModulePrices(data.modules);
        StatsEmbed.addField('Cost', Number.isNaN(cost) ? 'Cannot calculate' : approx(cost));

        var msgcontent = '';
        if (prdata.length > 1 && prdata[1] !== false) {
            var skills = GetRequiredSkills(data.skills, prdata[1]);
            var spreq = GetSkillSP(skills).reduce((acc, v) => acc + v.sp_required, 0);
            if (skills.length <= 0) {
                msgcontent = 'You can fly this!';
            } else {
                msgcontent = "You need some more skills to fly that.";
                StatsEmbed.addField('Skills Required', skills.slice(0,5).map(v => "**" + v.skill + "**: " + v.level + " (" + v.current_level + ")").join("\n") + "\nTotal SP: **" + spreq + "**");
            }
        }

        message.channel.send(msgcontent, {
            embed: StatsEmbed
        });
    }).catch(function(e) {
        message.channel.send("Sorry, I wasn't able to process that. Let <@229419335930609664> know about it.");
    });
}

export {EFTFitStats};
