const discord = require('discord.js');
const fs = require('fs');
const http = require('http');
var https = require('https');

const bot = new discord.Client();
const prefix = "&";
const color = 0xff9900;
const help = 'source - The bot\'s source (on GitHub)\n' +
'neko - Image from nekos life API\n' +
'ass - Image from obutts.ru API\n' +
'boobs - Image from oboobs.ru API\n' +
'help - Gives all the commands and their description\n' +
'yandere - Search on yande.re API\n' +
'invite - Gives an invitation link';
const invitation = 'https://discordapp.com/oauth2/authorize?client_id=559457783892934656&scope=bot&permissions=3072';

var prefixer = function (text) {
    return prefix + text;
};

bot.on('ready', function () {
    console.log('The bot is ready !');
});

bot.on('message', function (message) {
    if (message.channel.nsfw) {
        if (message.content.startsWith(prefixer('help'))) {
            message.channel.send({embed: {
                color: color,
                title: 'Help menu',
                description: help
            }});
        } else if (message.content.startsWith(prefixer('invite'))) {
            message.channel.send(invitation);
        } else if (message.content.startsWith(prefixer('source'))) {
            message.channel.send('https://www.github.com/TheDevKiller/NSFWBotJS');
        } else if (message.content.startsWith(prefixer('neko'))) {
            var args = message.content.split(' ');
            if (args[1] === undefined) {
                message.channel.send('The command requires an argument');
            } else {
                var url = 'https://nekos.life/api/v2/img/' + args[1].toLowerCase();
                https.get(url, function(res) {
                    var data = '';
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', function (res) {
                        message.channel.send(JSON.parse(data)['url']);
                    });
                });
            }
        } else if (message.content.startsWith(prefixer('ass'))) {
            http.get('http://api.obutts.ru/butts/0/1/random/', function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function (res) {
                    message.channel.send('http://media.obutts.ru/' + JSON.parse(data)[0]['preview']);
                });
            });
        } else if (message.content.startsWith(prefixer('boobs'))) {
            http.get('http://api.oboobs.ru/boobs/0/1/random', function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function (res) {
                    message.channel.send('http://media.oboobs.ru/' + JSON.parse(data)[0]['preview']);
                });
            });
        } else if (message.content.startsWith(prefixer('yandere'))) {
            var args = message.content.split(' ');
            var search = '';
            for (var i = 1; i < args.length; i++) {
                search += args[i] + ' ';
            }
            search = encodeURIComponent(search);
            https.get('https://yande.re/post.json?limit=42&tags=' + search, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function (res) {
                    message.channel.send(JSON.parse(data)[0]['jpeg_url']);
                })
            })
        }
    } else if (message.content.startsWith(prefix)) {
        message.channel.send('Please use a NSFW channel, there are children here');
    }
});

fs.readFile('token', 'UTF-8', function (err, data) {
    bot.login(data);
});