const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');

// making sure requried environment variables are set
let missingEnvs = [];

if (!process.env.GITHUB_APP_PRIVATE_KEY_PATH) {
    missingEnvs.push('GITHUB_APP_PRIVATE_KEY_PATH');
}

if (!process.env.GITHUB_APP_ID) {
    missingEnvs.push('GITHUB_APP_ID');
}

if (!process.env.GITHUB_APP_CLIENT_ID) {
    missingEnvs.push('GITHUB_APP_CLIENT_ID');
}

if (!process.env.GITHUB_APP_SECRET) {
    missingEnvs.push('GITHUB_APP_SECRET');
}

if (missingEnvs.length > 0) {
    // one or more required environment variables are missing
    throw new Error(`Required environment variable(s) (${missingEnvs.join(', ')}) missing value`);
}

// checking that the private cert path specified exists
if (!fs.existsSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH)) {
    throw new Error(`unable to find file specified in environment variable GITHUB_APP_PRIVATE_KEY_PATH. Supplied value: ${process.env.GITHUB_APP_PRIVATE_KEY_PATH}`);
}

const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID,
    privateKey: fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH, "utf-8"),
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
});

module.exports = {
    auth
}