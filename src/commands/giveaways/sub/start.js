const { ChannelType } = require("discord.js");

/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').GuildTextBasedChannel} giveawayChannel
 * @param {number} duration
 * @param {string} prize
 * @param {number} winners
 * @param {import('discord.js').User} [host]
 * @param {string[]} [allowedRoles]
 */
module.exports = async (member, giveawayChannel, duration, prize, winners, host, allowedRoles = []) => {
  try {
    if (!host) host = member.user;
    if (!member.permissions.has("ManageMessages")) {
      return "You need to have the manage messages permissions to start giveaways.";
    }

    if (!giveawayChannel.type === ChannelType.GuildText) {
      return "You can only start giveaways in text channels.";
    }

    /**
     * @type {import("discord-giveaways").GiveawayStartOptions}
     */
    const options = {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: host,
      thumbnail: "https://i.imgur.com/DJuTuxs.png",
      messages: {
        giveaway: "<a:Giveaways:1362988756675727471> **GIVEAWAY** <a:Giveaways:1362988756675727471>",
        giveawayEnded: "<a:Giveaways:1362988756675727471> **GIVEAWAY ENDED** <a:Giveaways:1362988756675727471>",
        inviteToParticipate: "React with <:present:1362988775151767743> to enter",
        dropMessage: "Be the first to react with <:present:1362988775151767743> to win!",
        hostedBy: `\nHosted by: ${host.username}`,
      },
    };

    if (allowedRoles.length > 0) {
      options.exemptMembers = (member) => !member.roles.cache.find((role) => allowedRoles.includes(role.id));
    }

    await member.client.giveawaysManager.start(giveawayChannel, options);
    return `Giveaway started in ${giveawayChannel}`;
  } catch (error) {
    member.client.logger.error("Giveaway Start", error);
    return `An error occurred while starting the giveaway: ${error.message}`;
  }
};
