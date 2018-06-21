const GitLab = require('gitlab/dist/es5').default;

module.exports = (config, stuff) => {
  const logger = stuff.logger;
  logger.info("Initializing edboxes-auth.");

  return {
    async adduser(gitlabUsername, gitlabToken, cb) {
      logger.debug(`Adduser invoked for '${gitlabUsername}'.`);

      const api = new GitLab({
        url: config.gitlabServer,
        token: gitlabToken
      });

      try {
        const currentUser = await api.Users.current();

        if (currentUser.username !== gitlabUsername) {
          logger.warn(`GitLab user '${gitlabUsername}' given for a token owned by ${currentUser.username}.`);
          cb(null, false);
        } else {
          logger.debug("Everything seems OK.");
          cb(null, true);
        }
      } catch(err) {
        logger.error(err);
        cb(null, false);
      }
    },

    async authenticate(gitlabUsername, gitlabToken, cb) {
      logger.debug(`Login attempt: ${gitlabUsername}`);

      try {
        const api = new GitLab({
          url: config.gitlabServer,
          token: gitlabToken
        });

        logger.debug("Fetching user from GitLab.");
        const currentUser = await api.Users.current();
        if (!currentUser || currentUser.username !== gitlabUsername) {
          logger.warn("No user or the username doesn't match the token holder.");
          cb(null, false);
        } else {
          logger.debug("Building access group list.");
          const accessGroups = [ currentUser.username ];

          const userGroups = await api.Groups.all({ membership: true });
          for (const userGroup of userGroups) {
              accessGroups.push("member:" + userGroup.name);
          }

          const userOwnedGroups = await api.Groups.all({ owned: true });
          for (const userOwnedGroup of userOwnedGroups) {
              accessGroups.push("owner:" + userOwnedGroup.name);
          }

          logger.debug(`groups for ${gitlabUsername}: ${accessGroups.join(", ")}`);
          cb(null, accessGroups);
        }
      } catch (err) {
        logger.info(`Auth failed: ${err.message}`);
        cb(null, false);
      }
    }
  };
};
