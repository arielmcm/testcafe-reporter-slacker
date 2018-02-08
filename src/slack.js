const webhookUrl = require('../../../tconf').WEBHOOK_URL;
const axios = require('axios');

export default class Slack {
    static sendMessage (message) {
        axios({
            method: 'post',
            url:    webhookUrl,
            data:   {
                attachments: [{
                    text:  message,
                    color: 'good'
                }]
            }
        }).catch(error => {
            console.log(error);
        });
    }
}
