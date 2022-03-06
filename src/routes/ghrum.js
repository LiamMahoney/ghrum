const express = require('express');
const router = express.Router();
const ghrumController = require('../controllers/ghrum');
const { verifyWebhookSecret } = require('../middlewares/verifyWebhookSecret');

/**
 * GET request - can be used to check that ghrum is running.
 */
router.get('/', ghrumController.get);

/**
 * POST request - all github webhooks get sent as POST requests, so this route
 * handles all incomming webhooks. Verifies the webhook's secret value matches
 * the secret defined in configuration.
 */
router.post('/', verifyWebhookSecret, ghrumController.post);

module.exports = router;