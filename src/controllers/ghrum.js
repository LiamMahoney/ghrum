const { handleHook } = require('../services/ghrum');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function get(req, res, next) {
    try {
        res.json({'message': 'ok'});
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function post(req, res, next) {
    try {
        // don't wait for handleHook to be finished - just respond that the
        // webhook was recieved successfully
        handleHook(req.headers['x-github-event'], req.body);

        res.status(200).json({'message': 'ok'});

    } catch (err) {
        throw err;
    }
}

module.exports = {
    get,
    post
};