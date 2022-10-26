const { milestone } = require('./hooks/milestone');
const { issues } = require('./hooks/issues');
const { project } = require('./hooks/project');
const { projectCard } = require('./hooks/project_card');
const { pullRequest } = require('./hooks/pull_request');
const { log } = require('../utils/log');

/**
 * The main controller of the program. This function decides
 * what type of hook was sent and passes the data to the 
 * appropriate part of the program to appropriately respond
 * to what was done.
 * 
 * @param {string} type: webhook type that was recieved
 * @param {object} data: post data from webhook
 */
async function handleHook(type, data) {
    try {
        log.info(`ghrum recieved hook with type: ${type} and action ${data.action}`);
        switch (type) {
            case 'project':
                return await project(data);
            case 'milestone':
                return await milestone(data);
            case 'project_card':
                return await projectCard(data);
            case 'issues':
                return await issues(data);
            case 'pull_request':
                return await pullRequest(data);
        }
    } catch (err) {
        if (err.name === 'AxiosError') {
            // makes stack available for AxiosError
            Error.captureStackTrace(err);
            // web request error - log details from request / response
            console.error(JSON.stringify({STATUS_CODE: err.response.status, STATUS_TEXT: err.response.statusText, RESPONSE_BODY: err.response.data, METHOD: err.request.method, HOST: err.request.host, PATH: err.request.path, STACK_TRACE: err.stack}));
        } else {
            console.error(err.stack);
        }
    }
}

module.exports = {
    handleHook
}