var libxml = require('libxmljs');
var fs = require('fs');
var xmlContents = fs.readFileSync('./skills.xml');
var xmlDoc = libxml.parseXmlString(xmlContents);

var skillNodes = xmlDoc.find("//*[@typeName]");

var skillArr = skillNodes.map(function(v) {
    if (v.attr('groupID').value() == '505') return false;
    return {
        name: v.attr('typeName').value(),
        typeID: v.attr('typeID').value(),
        groupID: v.attr('groupID').value(),
        description: v.find('description')[0].text(),
        rank: v.find('rank')[0].text(),
        requiredSkills: v.find("rowset[@name='requiredSkills']")[0].find('row').map(function(sv) {
            return {
                id: sv.attr('typeID').value(),
                skillLevel: sv.attr('skillLevel').value(),
            };
        }),
        primaryAttribute: v.find('requiredAttributes/primaryAttribute')[0].text(),
        secondaryAttribute: v.find('requiredAttributes/secondaryAttribute')[0].text(),
    };
}).filter(v => v);

var groupArr = xmlDoc.find("//row[@groupName]").map(v => {
    return {
        id: v.attr('groupID').value(),
        name: v.attr('groupName').value(),
    };
}).filter((v, i, arr) => arr.findIndex(t => (v.id == t.id)) == i);

fs.writeFileSync('./skills.json', JSON.stringify(skillArr));
fs.writeFileSync('./groups.json', JSON.stringify(groupArr));
