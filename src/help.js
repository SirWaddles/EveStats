const HELP_STRING = `Hey! Hobgoblin is a bot built by <@229419335930609664> that was mainly just made to watch plex prices. Here's some commands:
\`plexbot plex <days>\` - This generates a graph of the buy and sell plex prices over the past n days. The graph will be deleted in 10 minutes after asking for it so it doesn't shit up the chat.
\`plexbot skill <days>\` - Same as above, but for skill injectors. This is just Jita at the moment instead of IChooseYou, working on fixing this.
\`plexbot price\` - Shows a list of how much a skill injector costs in USD depending on the number of plex bought.
\`plexbot isk\` - Shows a list of how much isk you can currently get for each plex package.
\`plexbot authorize\` - Allows you to register your ESI Authorization to Hobgoblin so some other functions will work.
\`plexbot training <mention>\` - Shows you what you're currently training, and the total amount of time left on your skill queue. With no parameters, it will show your details, but you can mention other people at the end of the command to show *their* training.
\`plexbot help\` - Shows this message.
\`plexbot jimmy\` - PMs a link with authorization to the Jimmy Pathfinding Utility
\`plexbot avatar\` - Shows your EVE Display Picture

You can also post an EFT fit copied from the in-game fitting window, or from Pyfa. This will generate an embed with various status about the fit, and details about whether you can fly it. Note that the format that these get posted in are very specific, here's an example of what it would look like **in your text box**
\\\`\\\`\\\`
[Drake, Drake]
Damage Control II
\\\`\\\`\\\`

Optionally, after the final backticks you can mention a user to see if *they* can fly it instead of you.
`;

function HelpCommand(message, params) {
    message.channel.send(HELP_STRING).then(function(sent) {
        sent.delete(1000 * 60 * 10);
    });
}

export default HelpCommand;
