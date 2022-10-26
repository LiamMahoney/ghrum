const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Gets pull request project cards for a PR in a repository.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} prNumber pull request number
 * @param {String} repoOwner owner of the repository
 * @param {String} repoName name of the repository
 */
async function getProjectCards(prNumber, repoOwner, repoName) {
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
                repository(name: "${repoName}", owner: "${repoOwner}"){
                    parentObject: pullRequest(number: ${prNumber}) {
                        title
                        projectCards {
                            edges {
                                node {
                                    id
                                    databaseId
                                    column {
                                        id
                                        name
                                    }
                                    project {
                                        id
                                        name
                                        state
                                        columns(first:20) {
                                            edges {
                                                node{
                                                    id
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`
        }

        const response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getProjectCards
}