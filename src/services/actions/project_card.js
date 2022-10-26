const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Moves the project card to the specified column
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} cardID project card ID to move
 * @param {String} columnID column ID to move project card to 
 */
async function moveProjectCard(installationID, cardID, columnID) {
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

        let payload = {
            query: `mutation {
                moveProjectCard(input:{cardId: "${cardID}", columnId: "${columnID}"}) {
                    cardEdge {
                        node {
                            id
                            column {
                                name
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

        return `moved project card ${cardID} to column ${columnID}`;

    } catch (err) {
        throw err;
    }
}


/**
 * Delete the project card.
 *
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} cardID project card ID to remove
 */
async function deleteProjectCard(installationID, cardID) {
    try {

        const path = `/projects/columns/cards/${cardID}`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Accept: 'application/vnd.github.inertia-preview+json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        let response = await axios.delete(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            { headers }
        );

        return response.data;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    moveProjectCard,
    deleteProjectCard
}