const express = require("express");
const app = express();

// Minimal HTTP server to keep Render service alive
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000, () => {
  console.log("HTTP server started on port", process.env.PORT || 3000);
});
require("dotenv").config();
require("module-alias/register");
require("@helpers/extenders/Message");
require("@helpers/extenders/Guild");
require("@helpers/extenders/GuildChannel");
const { initializeMongoose } = require("@src/database/mongoose");
const { BotClient } = require("@src/structures");
const { validateConfiguration } = require("@helpers/Validator");
validateConfiguration();
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));

(async () => {
  if (client.config.DASHBOARD.enabled) {
    client.logger.log("Launching dashboard");
    try {
      const { launch } = require("@root/dashboard/app");

      await launch(client);
    } catch (ex) {
      client.logger.error("Failed to launch dashboard", ex);
    }
  } else {
    await initializeMongoose();
  }
  await client.login(process.env.BOT_TOKEN);
})();
