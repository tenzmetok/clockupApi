const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

export const sendEmail = async ({
  from = '',
  to = [],
  cc = [],
  replyTo = [],
  Subject = {
    Charset: 'UTF-8',
    Data: '',
  },
  Body = {
    Html: {
      Charset: 'UTF-8',
      Data: '',
    },
    Text: {
      Charset: 'UTF-8',
      Data: '',
    },
  },
}) => {
  // Create sendEmail params
  const params = {
    Destination: {
      /* required */
      CcAddresses: cc,
      ToAddresses: to,
    },
    Message: {
      /* required */
      Body,
      Subject,
    },
    Source: from /* required */,
    ReplyToAddresses: replyTo,
  };
  try {
    const ses = new AWS.SES({ apiVersion: '' });
    return new Promise(function (resolve, reject) {
      ses.sendEmail(params, function (err, data) {
        if (err) reject(err);
        // an error occurred
        else resolve(data); // successful response
      });
    });
  } catch (error) {
    console.log('Error while sending the email', error);
    return {};
  }
};
