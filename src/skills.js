import fetch from 'node-fetch';
import {ValidateCharacter} from './auth';
import {GetCharacters, GetCharacterByName} from './dbstore';
import skilldata from '../skills.json';
import moment from 'moment';

const SKILL_LIST = [];

function UpdateSkills(input) {
    return ValidateCharacter(input).then(function(character) {
        return fetch("https://esi.tech.ccp.is/latest/characters/" + character.character_id + "/skills/", {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + character.access_token,
            },
            method: 'GET',
        }).then(r => r.json()).then(function(data) {
            SKILL_LIST.push({
                characterid: character.character_id,
                skills: data.skills,
                time: Date.now(),
            });
            return data.skills;
        });
    });
}

function GetSkillList(character) {
    var skills = SKILL_LIST.filter(v => (v.characterid == character.character_id) && (v.time > (Date.now() - 7200000)));
    if (skills.length <= 0) {
        return UpdateSkills(character);
    }
    return Promise.resolve(skills[0].skills);
}

export {GetSkillList};

const SKILL_LEVELS = [0, 250, 1164, 6586, 37255, 210745];

function GetSkillSP(skills) {
    return skills.map(v => Object.assign(v, {sp_required: skilldata.filter(s => s.typeID == v.id).reduce((acc, s) => s.rank, 0) * SKILL_LEVELS.slice(v.current_level + 1, v.level + 1).reduce((acc, s) => acc + s, 0)}));
}

export {GetSkillSP};

function GetSkillQueue(input) {
    return ValidateCharacter(input).then(function(character) {
        return fetch("https://esi.tech.ccp.is/latest/characters/" + character.character_id + "/skillqueue/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + character.access_token,
            },
            method: 'GET',
        }).then(r => r.json());
    });
}

function GetCharacterType(message, params) {
    if (message.mentions.users.size > 0) {
        return GetCharacters(message.mentions.users.first().id);
    } else if (params.length > 1) {
        params.shift();
        var characterName = params[0];
        return GetCharacterByName(characterName);
    } else {
        return GetCharacters(message.author.id);
    }
}

function ShowSkillLevel(message, params) {
    var targetSkill = skilldata.filter(v => v.name.toLowerCase().includes(params[1].toLowerCase()));
    if (targetSkill.length <= 0 || targetSkill.length > 5) {
        message.reply("Sorry, I couldn't find that skill.");
        return;
    }
    params.splice(1, 1);
    GetCharacterType(message, params).then(GetSkillList).then((skills) => {
        var skillMsg = targetSkill.map(skillTest => {
            var skillLevel = 'Unlearned';
            var [skillLoad] = skills.filter(v => v.skill_id == skillTest.typeID);
            if (skillLoad) skillLevel = skillLoad.trained_skill_level;
            return "**" + skillTest.name + "**: " + skillLevel;
        }).join("\n");
        message.channel.send(skillMsg);
    }).catch((e) => {
        console.error(e);
        message.reply("Something went wrong, idfk, shut up. Go yell at Waddles.");
    });
}

function ListSkillQueue(message, params) {
    return GetCharacterType(message, params).then(GetSkillQueue).then(function(data) {
        if (!Array.isArray(data)) {
            console.error(data);
            message.channel.send('ESI BORKEDE');
            return;
        }
        if (data.length <= 0) {
            message.channel.send('No skill in training. You should probably fix that.');
            return;
        }
        var currentIdx = 0;
        var now = moment();
        while (moment(data[currentIdx].finish_date) < now) {
            currentIdx++;
            if (currentIdx > data.length) break;
        }
        var currentData = skilldata.filter(s => data[currentIdx].skill_id == s.typeID)[0];
        var end = moment(data[data.length -1].finish_date);
        var currentEnd = moment(data[currentIdx].finish_date);
        var duration = moment.duration(end.diff(now));
        var currentDuration = moment.duration(currentEnd.diff(now));
        message.channel.send('Currently training: **' + currentData.name + ' ' + data[currentIdx].finished_level + '**');
        message.channel.send('Time left for current skill: **' + Math.ceil(currentDuration.asDays()) + ' days**');
        message.channel.send('Total queue time: **' + duration.humanize() + '**');


    }).catch(function(e) {
        console.error(e);
        message.reply("Sorry, something went wrong. Is your auth working?");
    });
}

function DisplayAvatar(message, params) {
    return GetCharacterType(message, params).then(ValidateCharacter).then(function(data) {
        return fetch("https://esi.tech.ccp.is/latest/characters/" + data.character_id + "/portrait/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET',
        });
    }).then(r => r.json()).then(function(data) {
        message.channel.send(data['px512x512']);
    });
}

export {ListSkillQueue, DisplayAvatar, ShowSkillLevel};
