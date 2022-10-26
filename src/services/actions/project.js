const { auth } = require('./auth');
const axios = require('axios').default;

/**
 * Gets project information from the project URL returned 
 * from the webhook.
 * 
 * @param {string} projURL URL for github GET project request - from webhook
 */
async function getProject(installationID, projectURL) {
    try {

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.get(projectURL, { headers });

        return response.data;

    } catch (err) {
        throw err;
    }
}

/**
 * Gets project column information from the column URL returned 
 * from the webhook.
 *  
 * @param {int} installationID ID of app installation - from webhook
 * @param {string} columnURL URL for github GET project column request - from webhook
 */
async function getColumn(installationID, columnURL) {
    try {

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const response = await axios.get(columnURL, { headers });

        return response.data;

    } catch(err) {
        throw err;
    }
}

/**
 * Gets all of the projects within the repository.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} repoOwner Owner of the repository to look in for projects
 * @param {String} repoName name of the reposiotyr to look in for projects
 */
async function getRepoProjects(installationID, repoOwner, repoName) {
    try {

        const path = `/repos/${repoOwner}/${repoName}/projects`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Accept: 'application/vnd.github.inertia-preview+json',
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
 * Gets all of the columns in the project.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} URL GET project API URL 
 */
async function getProjectColumns(installationID, URL) {
    try {
        
        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            "Accept": "application/vnd.github.inertia-preview+json",
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        let response = await axios.get(URL, { headers });

        return response.data;

    } catch (err) {
        throw err;
    }
}


/**
 * Creates a new copy of a repository project.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} ownerID nodeID of the owner of the project
 * @param {String} cloneID nodeID of the project to clone
 * @param {String} name name of the new project
 * @param {String} body description of the new project
 */
async function cloneProject(installationID, ownerID, cloneID, name, body) {
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
            query: `mutation {
                cloneProject(input: {
                    targetOwnerId: "${ownerID}",
                    sourceId: "${cloneID}",
                    includeWorkflows: true,
                    name: "${name}",
                    body: "${body}",
                    public: true
                }) {
                    project {
                        name
                    }
                }
            }`
        }

        const response = await axios.post(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        );

        return `created milestone project '${resp.data.cloneProject.project.name}'`;

    } catch (err) {
        throw err;
    }
}

/**
 * Closes a project with a given name.
 * 
 * @param {int} installationID ID of app installation - from webhook
 * @param {String} project the name of the project to look for and close
 * @param {String} repoName name of the repository the project would be in
 * @param {String} repOwner github login of the owner of the repository
 * @returns {String} message stating what project was closed
 */
async function closeProjectName(installationID, project, repoName, repoOwner) {
    try {

        const projectObj = await findProjectFromName(project, repoName, repoOwner);

        const path = `/projects/${projectObj.id}`;

        const { token } = await auth({
            type: 'installation',
            installationId: installationID
        });

        const headers = {
            Accept: "application/vnd.github.inertia-preview+json",
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const pyaload = {
            state: "closed"
        }

        const response = await axios.patch(
            `https://${process.env.GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        )

        return `closed project '${project}'`;

    } catch (err) {
        throw err;
    }
}

/**
 * Finds a project based on the project name and returns details about that
 * project. If not found throws an error.
 * 
 * @param {String} projectName the name of the project to look for
 * @param {String} repoName name of the repository the project would be in
 * @param {String} repOwner github login of the owner of the repository
 * @returns {Object} project details for the project with the given name
 */
async function findProjectFromName(installationID, projectName, repoName, repoOwner) {
    try {
        let projects = await getRepoProjects(installationID, repoOwner, repoName);

        for (let project of projects) {
            if (project.name.toLowerCase().trim() === projectName.toLowerCase().trim()) {
                return project;
            }
        }

        throw error(`couldn't find a project with the name of ${projectName} in the repository ${repoName}`);

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getProject,
    getColumn,
    getRepoProjects,
    getProjectColumns,
    cloneProject,
    closeProjectName
}