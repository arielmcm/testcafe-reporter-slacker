const webhookUrl = require('../../../tconf').WEBHOOK_URL;
const axios = require('axios');

export default class Slack {
    static sendSuccessMessage (message) {
        Slack.sendMessage(message, 'good');
    }
    static sendErrorMessage (message) {
        Slack.sendMessage(message, 'danger');
    }
    static sendMessage (message, type) {
        axios({
            method: 'post',
            url:    webhookUrl,
            data:   {
                attachments: [{
                    text:  message,
                    color: type
                }]
            }
        }).catch(error => {
            console.log(error);
        });
    }
}
