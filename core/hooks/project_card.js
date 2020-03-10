const { Issue } = require('../states');

/**
 * 
 * @param {*} data 
 */
function projectCard(data) {
    return new Promise((resolve, reject) => {

        switch (data.action) {
            case 'created':
                // issue added to project or standalone project card created
                return resolve(Issue.issueAddedToProject(data));
                break;
        }   
    });
}

module.exports = {
    projectCard
}