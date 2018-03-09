
var env = require('node-env-file');
env(__dirname + '/.env');
if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}
var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot']
};

bot_options.json_file_store = __dirname + '/.data/db/';

var controller = Botkit.slackbot(bot_options);



controller.startTicking();

var webserver = require(__dirname + '/components/express_webserver.js')(controller);

require(__dirname + '/components/user_registration.js')(controller);
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "controllers");
require("./controllers/main.js")(controller)
// require("fs").readdirSync(normalizedPath).forEach(function(file) {
//   require("./controllers/" + file)(controller);
// });


