const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Gets all of the issues and pull requests in the milestone.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} milestoneNumber the milestone's number
 * @param {int} itemCount the number of 'open_issues' in the milestone
 * @param {String} repoOwner the Github login of the repository owner
 * @param {String} repoName the name of the Github repository
 */
async function getMilestoneItems(installationID, milestoneNumber, itemCount, repoOwner, repoName) {
    try {
        const path = `/graphql`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const payload = {
            query: `query {
                repository(name: "${repoName}", owner: "${repoOwner}") {
                    milestone(number: ${milestoneNumber}) {
                        issues(first: ${itemCount}) {
                            nodes {
                                title,
                                databaseId,
                                number
                            }
                        }
                        pullRequests(first: ${itemCount}) {
                            nodes {
                                title,
                                databaseId,
                                number
                            }
                        }
                    }
                }
            }`
        }

        const response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        )

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Gets all of the milestones in the repository.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} repoOwner github login of the repository owner
 * @param {String} repoName name of the github repository
 * @returns {Array} https://developer.github.com/v3/issues/milestones/#list-milestones
 */

async function getRepoMilestones(installationID, repoOwner, repoName) {
    try {
        const path = `/repos/${repoOwner}/${repoName}/milestones`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.get(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Closes a milestone.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} number milestone number 
 * @param {String} repoOwner login of the owner of the repo the milestone is in
 * @param {String} repoName name of the repo the milestone is in
 */
async function close(installationID, number, repoOwner, repoName) {
    try {
        const payload = {
            state: "closed"
        }

        return await update(installationID, number, payload, repoOwner, repoName);
    } catch (err) {
        throw err;
    }
}

/**
 * Updates a github milestone.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} number milestone number
 * @param {Object} payload = {
 *  title: "string",
 *  state: "one of 'open' or 'closed'",
 *  description: "string",
 *  due_on: "YYYY-MM-DDTHH:MM:SSZ"
 * } 
 * @param {String} repoOwner login of the repository owner
 * @param {String} repoName name of the repository the milestone is in
 */
async function update(installationID, number, payload, repoOwner, repoName) {
    try {
        const path = `/repos/${repoOwner}/${repoName}/milestones/${number}`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.patch(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getMilestoneItems,
    getRepoMilestones,
    close
}