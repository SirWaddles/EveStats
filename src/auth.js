import http from 'http';
import qs from 'querystring';
import crypto from 'crypto';
import {OAuth2} from 'oauth';
import {Hobgoblin} from './discordtoken';

var ONGOING_AUTH = [];

function AuthorizeBot(message, params) {
    var statestring = crypto.randomBytes(20).toString('hex');
    ONGOING_AUTH.push({
        state: statestring,
        message: message,
        stage: 'start',
    });
    var url = "https://eve.genj.io/oauth/" + statestring;
    message.author.send("Hey, awesome! Use this link, thanks :smile:\n" + url);
}

export {AuthorizeBot};

const oauth2 = new OAuth2(Hobgoblin.client_id,
                        Hobgoblin.secret_key,
                        'https://login.eveonline.com/',
                        'oauth/authorize',
                        'oauth/token',
                        null);

function writeResponse(res, response) {
    res.writeHead(200, {
        'Content-Length': response.length,
        'Content-Type': 'text/html',
    });
    res.end(response);
}

http.createServer(function(req, res) {
    var params = req.url.split('/');
    if (params.length <= 2) {
        writeResponse(res, "not valid");
        return;
    }

    console.log(params);

    if (params[2].indexOf('key') === 0) {
        var qsObj = qs.parse(params[2].split('?')[1]);
        oauth2.getOAuthAccessToken(
            qsObj.code,
            {redirect_uri: 'https://eve.genj.io/oauth/key/'},
            function (e, access_token, refresh_token, results) {
                if (e) {
                    res.end(e);
                    return;
                }
                if (results.error) {
                    res.end(JSON.stringify(results));
                    return;
                }
                var authstate = ONGOING_AUTH.filter(v => v.state == qsObj.state);
                if (authstate.length <= 0) return;
                authstate[0].access_token = access_token;
                authstate[0].refresh_token = refresh_token;
                authstate[0].stage = 'tokens';
                authstate[0].message.reply('Thanks!');
                console.log(authstate);
                return;
            }
        );
    }

    var authstate = ONGOING_AUTH.filter(v => v.state == params[2]);
    if (authstate.length > 0) {
        var authURL = oauth2.getAuthorizeUrl({
            redirect_uri: 'https://eve.genj.io/oauth/key',
            scope: ['esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-markets.structure_markets.v1'],
            state: authstate[0].state,
            response_type: 'code',
        });
        authstate[0].stage = 'request';

        res.writeHead(302, {
            'Location': authURL,
        });
        res.end();
        return;
    }
    writeResponse(res, "not valid");
}).listen(8091);
