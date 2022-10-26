const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Gets issue information from the issue URL returned 
 * from a webhook.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {string} issueURL URL for github 'GET issue' request - from webhook
 */
async function getIssue(installationID, issueURL) {
    try {

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.get(issueURL, { headers });

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Adds labels to the supplied GitHub issue.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} issue Github issue number
 * @param {Array} labels label name strings to add e.g. ['duplicate', 'bug']
 * @param {String} repoOwner Github login of the owner of the repo
 * @param {String} repoName name of the repository
 * @returns {String} contains which labels were added to which issue
 */
async function addLabels(installationID, issue, labels, repoOwner, repoName) {
    try {

        const path = `/repos/${repoOwner}/${repoName}/issues/${issue}/labels`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            { labels },
            { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Removes a label from a GitHub issue.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} issue Github issue number
 * @param {String} label label name
 * @param {String} repoOwner Github login of the owner of the repo
 * @param {String} repoName name of the repository
 * @returns {String} contains which label was removed from which issue
 */
async function removeLabel(installationID, issue, label, repoOwner, repoName) {
    try {
        
        const path = `/repos/${repoOwner}/${repoName}/issues/${issue}/labels/${label}`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.delete( 
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Gets all of the project cards associated to the issue. Also gets
 * all of the project columns in each project card's corresponding 
 * project.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} issueNumber github issue number 
 * @param {String} repoOwner Github login of the owner of the repository
 * @param {String} repoName name of the repository
 */
async function getProjectCards(installationID, issueNumber, repoOwner, repoName) {
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
                repository(owner:"${repoOwner}", name:"${repoName}") {
                    parentObject: issue(number:${issueNumber}) {
                        title
                        projectCards {
                            edges{
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
                                        columns(first: 20){
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

        let response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Adds an issue to a project. 
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} issueNumber the number of the issue
 * @param {String} projectName the name of the project to add the issue to
 * @param {String} columnID the ID of the column to add the issue to
 * @param {String} contentID issue ID to associated with the card
 * @param {String} contentType describes the contentID, either ['Issue', 'PullRequest']
 */
async function addToProject(installationID, issueNumber, projectName, columnID, contentID, contentType) {
    try {
        
        const path = `/projects/columns/${columnID}/cards`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const payload = {
            content_id: contentID,
            content_type: contentType
        }

        const response = await axios.post( 
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return `Added issue #${issueNumber} to the project '${projectName}'`;

    } catch (err) { 
        throw err;
    }
}

/**
 * Removes the milestone from an issue or pull request.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {int} issueNumber issue / pr number 
 * @param {String} repoOwner github login of the repository owner
 * @param {String} repoName name of the github repository
 */
async function removeMilestoneFromIssue(installationID, issueNumber, repoOwner, repoName) {
    try {

        const path = `/repos/${repoOwner}/${repoName}/issues/${issueNumber}`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const payload = {
            milestone: null
        }

        const response = await axios.patch( 
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return `removed milestone from #${issueNumber}`;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getIssue,
    addLabels,
    removeLabel,
    getProjectCards,
    addToProject,
    removeMilestoneFromIssue
}