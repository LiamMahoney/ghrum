const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');
const https = require('https');
const axios = require('axios');

// TODO: need to update requests to follow this flow. / update whole requests structure
// 

// this comes in webhook data - data.installtion.id
const INSTALLATION_ID = 29343315;
const GITHUB_API_BASE_URL = 'api.github.com';

const auth = createAppAuth({
    appId: 57507,
    privateKey: fs.readFileSync("/Users/liammahoney/Downloads/ghrum-app.2022-09-17.private-key.pem", "utf-8"),
    clientId: "Iv1.155662b22dcdbc56",
    clientSecret: "1cb58ea776d667e51d827fd0821b48a7ff875f5e",
});

async function getIssue2(issueNumber) {
    try {

        const { token } = await auth({
            type: 'installation',
            installationId: INSTALLATION_ID
        });
        
        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'ghrum'
        }

        const resp = await axios.get(`https://api.github.com/repos/LiamMahoney/ghrumx/issues/${issueNumber}`, {headers: headers});

        return resp.data;

    } catch (err) {
        throw err;
        console.error(`STATUS CODE: ${err.response.status}\nMETHOD: ${err.request.method}\nHOST: ${err.request.host}\nPATH: ${err.request.path}\nRESPONSE BODY: ${err.response.data.message}`);
    }
}

async function getIssue(issueNumber) {
    try {

        const { token } = await auth({
            type: 'installation',
            installationId: INSTALLATION_ID
        });

        let options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/LiamMahoney/ghrum/issues/${issueNumber}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': 'ghrum'
            }
        }

        let req = https.request(options, (res) => {
            let data = '';
            console.debug(`GET response status code: ${res.statusCode}`);
    
            res.on('data', (d) => {
                data += d;
            });
    
            res.on('end', function () {
                return data;
            });
        });
    
        req.on('error', (err) => {
            throw err;
        });
    
        req.end();

    } catch (err) {
        throw err;
    }
}

async function createLabel(repoOwner, repoName, labelName) {
    try {

        const path = `/repos/${repoOwner}/${repoName}/labels`;

        const { token } = await auth({
            type: 'installation',
            installationId: INSTALLATION_ID
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
            `https://${GITHUB_API_BASE_URL}${path}`,
            payload, { headers }
        )

        return response.data;

    } catch (err) {
        throw err;
    }
}

function randomColor() {
    return Math.floor(Math.random() * Math.floor(16777215)).toString(16);
}

// getIssue2(43).then((data) => {
//     // data is undefined but debugged and right before returning in get_issue it's the response from the API - working successfully
//     console.log('resp', data);
// });

createLabel('LiamMahoney', 'ghrum', 'TEST_LABEL');