const crypto = require('crypto');

/**
 * Verifies that the secret value sent with the webhook matches the secret
 * defined in the application's configuration.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function verifyWebhookSecret(req, res, next) {
    // https://gist.github.com/stigok/57d075c1cf2a609cb758898c0b202428
    const payload = JSON.stringify(req.body);

    if (!payload) {
        return next('Request body empty');
    }

    const sig = req.get('X-Hub-Signature') || '';
    const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET);
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(sig, 'utf8');
    
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        return res.status(401).json({'message': 'unauthorized'})
    }

    return next();
}

module.exports = {
    verifyWebhookSecret
}