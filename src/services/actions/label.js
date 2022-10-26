const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Gets all of the labels in the repository.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {string} repoOwner owner of the repo to get labels from
 * @param {string} repoName name of the repo to get labels from
 * @returns {Array} list of objects that represent a label
 */
async function getAllLabels(installationID, repoOwner, repoName) {
    try {
        const path = `/repos/${repoOwner}/${repoName}/labels`;

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
        )

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Creates a new label with a random color.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {string} repoOwner owner of the repo to add a label to
 * @param {string} repoName name of the repo to add a label to
 * @param {string} labelName the name of the label to create
 */
async function createLabel(installationID, repoOwner, repoName, labelName) {
    try {
        const path = `/repos/${repoOwner}/${repoName}/labelsx`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const color = randomColor();

        const payload = {
            name: labelName,
            color: color
        }

        const response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        )

    } catch (err) {
        console.error(err.stack);
        throw err;
    }
}

/**
 * Deletes a label from a repository.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} labelName the label to delete
 * @param {String} repoOwner the login of the owner of the repo
 * @param {String} repoName the name of the repo the label is in
 * @returns {String} states what label was deleted
 */
async function deleteLabel(installationID, labelName, repoOwner, repoName) {
    try {
        const path = `/repos/${repoOwner}/${repoName}/labels/${labelName}`;

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

        return `deleted label '${labelName}' from repository '${repoName}'`;

    } catch (err) {
        throw err;
    }
}

/**
 * Generates a random color.
 * 
 * @returns {string} hex descibing a color
 */
function randomColor() {
    return Math.floor(Math.random() * Math.floor(16777215)).toString(16);
}

module.exports = {
    getAllLabels,
    createLabel,
    deleteLabel
}