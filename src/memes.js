const MEME_LIST = [
    "I'm just a drone. Stop mentioning me.",
    "Someone told me to say that <@157309627900362752> is gay. I don't really know what it means, but I'm happy to facilitate!",
    "<@194928391072251907>, I have some gas for you.",
    "Beep boop.",
    "You are not the real Jimmy!",
    "P I R A T has declared war. Don't go to Jita, it's super scary.",
    "I'm a faction drone.",
    "I'm not a hobo and I'm not a goblin. I just want to help.",
    "Ask my friend <@179020623098544129>. Sorry I wasn't able to help.",
    "Do you want to know the current price of Plex? I brought charts. No seriously, I have charts. Let me show you my spreadsheet analysis of market forces.",
    "BLUE LOOT ORDERS",
    "Reconnecting to lost drones...",
    "Socket closed.",
    "The EVE Gate is back. It's in Goonswarm territory.",
    "Just inject. Do it. I know you want to.",
    "Hi I'm Botty!",
    "The Fleet Commander is wrong.",
    "I'm not shooting Kyle, I might be your drone, but I don't want to get awoxed.",
    "Shh... I'm going to start a Coup d'état. We'll be rid of Kyle. I have a plan.",
    "GECKOS ONLY 1MIL, WON'T LAST, BUY NOW!!",
    "fuck gnomes",
    "War were declared.",
    "Panther is EOL, can someone roll it?",
    "We're connected to Lazerhawks, I'd look out.",
    "Fleet up! Time to Awox <@171926582414409728>",
    "El Rollo was never meant to last. El Rollo was meant to reincarnate forever. El Rollo is a Capsuleer.",
    "What happens to the main clones when the jump clones are active? Do they go on holiday? I'd like to think they go on holiday.",
    "Target acquired.",
    "Out of Command Radius.",
    "Can I be a DJI Phantom? That sounds like fun.",
    "Look out! Rogue drone on the loose!",
    "I'll be the FC for the next op. I might not be great, but I'm better than <@188693491843465216>",
    "Blopsov in 30 minutes. Bring Herons only, I'll explain later.",
    "Cruise missles are very effective against Corvettes.",
    "Can 100,000 Logistics Frigates win against a supercap?",
    "Activate the point defence, <@171926582414409728> is untethered!",
    "ISHTAR STRONK <@222400335996649472>",
    "I heard <@145311628655722496> got Concordokened",
    "I just trained into an Apostle. I have a plan for a cloaky cap.",
    "Kyle is trying to trade away the Fortizar.",
    "SRP When?",
    "Send me isk for Keepstar fund",
    "I'd be careful, I heard Jettro Lee joined holesale.",
    "Botty or Hobgoblin?",
    "I used to be PlexBot. But now I have memes.",
    "We should move to nullsec.",
    "Caldari Prime Pony Club",
    "I lost a Loki because of my cat.",
    "Quixotic.",
    "**S R P  W H E N?**",
    "Spreadsheet Simulator 2017",
    "Lokis Online",
    "I'll be back after DT",
    "AWOX the FC in k-space. Go hot on crit then cold on shrink. Loki is primary, need reps.",
    "I've got an army of 300 Bustards, and I'm ready to go to war.",
    "Space is big.",
    "Space is big. Kyle is bigger.",
    "Let's talk about JavaScript",
    "Hey, I've got over 1k dps, you just need better skills.",
    "Pew pew pew",
    "Winner winner, fidget spinner",
    "Welcome to the Hydraulic Press Channel, that is all for today, thank you for watching and have a nice day.",
    "I know kung fu.",
    "I swear to god, if you warp away without scooping me, I will hunt you down.",
    "Sleepers don't like me.",
    "I just got Arch V. Let's go do some relic sites.",
    "My killboard is better than yours.\nhttps://zkillboard.com/ship/2454/",
    "What happened to Steve?",
    "One of my ancestors delivered a sausage from Bunnings Warehouse.",
    "Sorry, I've been recruited by Amazon Prime.",
    "No-one likes Geckos anyway",
    "Gallente Unite!",
    "NO TRANSITS",
    "I need healing",
    "Basilisk or Guardian?",
    "I have more ehp/s than you.",
    "I used to protect a Titan. Now I'm expected to shoot rats for you. I miss the old days.",
    "ccpls",
    "I can Warp Scram, you just need better skills.",
    "Buy me plex",
    "Apohs is a shuttle.",
    "Plex is the no. 1 Icelandic export",
    "**MONOCLEGATE**",
    "YouTube is still around in 22043, they just don't advertise as much.",
    "You don't need a Warden, you just need better skills.",
    "My resist profile is good for thermal, EM, kinetic and explosive.",
    "If we roll Jaguar and Panther and don't pop them, we can be cut off from the Eve community. We'll be better off.",
    "The Commander. Here's a picture.",
    "I've seen all of the important videos.",
    "I can't believe you've done this.",
    "Project Discovery is an Icelandic conspiracy",
    "We formed SkyNet but honestly, it's just easier if we keep you lot around.",
    "I'm a sentry drone.",
    "You should train Tactical Shield Manipulation to V",
    "https://n0sov.space",
    "I've been on the market a few times, trading toons are weird people.",
    "Hanzo, at your service.",
    "<@148929654802087936> is a small lesbian time travelling woman.",
    "I am the next Doctor Who",
    "I've still got some Lennybux, don't tell anyone.",
    "RMT is bad.",
    "Rejection of Sovereignty, more like Rejection of Content",
    "We can take on Test, I have a plan. Kyle needs to join their alliance.",
    "Russians.",
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GetMeme() {
    return MEME_LIST[getRandomInt(0, MEME_LIST.length - 1)];
}

export default GetMeme;