import fetch from 'node-fetch';
import {ValidateCharacter} from './auth';
import skilldata from '../skills.json';

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
            });
            return data.skills;
        });
    });
}

function GetSkillList(character) {
    var skills = SKILL_LIST.filter(v => v.characterid == character.character_id);
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
