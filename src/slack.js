const webhookUrl = require('../../../tconf').WEBHOOK_URL;
const axios = require('axios');

export default class Slack {
    static async sendMessage (message) {
        try {
            await axios({
                method: 'post',
                url:    webhookUrl,
                data:   {
                    attachments: [message]
                }
            });
        }
        catch (error) {
            console.log(error);
        }

    }
}
