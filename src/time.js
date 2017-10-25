import moment from 'moment';
import 'moment-timezone';

const ZONE_LIST = {};
const DATE_FORMAT = 'h:mm A dddd z';
var ZONE_PREFERENCES = [];

function DedupeZones(zones) {
    return [...new Set(zones)];
}

function BuildZoneList() {
    moment.tz.names().forEach(function(tz) {
        var mtz = moment.tz(tz);
        var abbrs = DedupeZones(mtz._z.abbrs);
        abbrs.forEach((v) => {
            if (!ZONE_LIST.hasOwnProperty(v)) ZONE_LIST[v] = [];
            ZONE_LIST[v].push(tz);
        });
    });
}

BuildZoneList();

function GetUserTime(message, user) {

}

function GetTimezoneTime(message, timezone) {
    if (!ZONE_LIST.hasOwnProperty(timezone)) {
        message.channel.send("I don't think that's a real timezone.");
        return;
    }

    var zoneprfs = ZONE_PREFERENCES.filter(v => v.tz == timezone)[0];
    if (!zoneprfs) {
        zoneprfs = {
            tz: timezone,
            confirmed: false,
            location: ZONE_LIST[timezone][0],
        };
    }

    var addprf = '';
    if (!zoneprfs.confirmed) {
        addprf = " (" + zoneprfs.location + ")\nIf this is wrong, use `plexbot time <zone> <locale>` to suggest another";
    }

    message.channel.send(moment().tz(zoneprfs.location).format(DATE_FORMAT) + addprf);
}

function ZoneSuggest(message, params) {
    var timezone = params[1];
    if (!ZONE_LIST.hasOwnProperty(timezone)) {
        message.channel.send("I don't think that's a real timezone.");
        return;
    }
    var list = ZONE_LIST[timezone];
    if (list.includes(params[2])) {
        var zoneprfs = {
            tz: timezone,
            confirmed: true,
            location: params[2]
        };
        ZONE_PREFERENCES = ZONE_PREFERENCES.filter(v => v.tz !== timezone).concat([zoneprfs]);
    } else {
        message.channel.send("Sorry, I don't have that location associated with that timezone.");
    }
}

function AskTime(message) {
    var params = message.content.trim().split(' ');
    if (params.length == 1) {
        message.channel.send(moment().utc().format(DATE_FORMAT));
        return;
    }

    if (message.mentions.users.size > 0) {
        return GetUserTime(message, message.mentions.users.first());
    }

    if (params.length == 2) {
        return GetTimezoneTime(message, params[1]);
    }
}

export {AskTime, ZoneSuggest};
