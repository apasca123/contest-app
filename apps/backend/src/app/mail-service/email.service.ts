// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailService {
  private ses: AWS.SES;

  constructor() {
    this.ses = new AWS.SES({
      region: 'eu-north-1', // sau altă regiune dacă este cazul
    });
  }

  async sendEmail(subject: string, body: string) {
    const params: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: ["pascaandrei58@gmail.com"], // adresa destinatarului
      },
      Message: {
        Body: {
          Text: {
            Data: body, // corpul emailului
            Charset: 'UTF-8',
          },
        },
        Subject: {
          Data: subject, // subiectul emailului
          Charset: 'UTF-8',
        },
      },
      Source: 'pascaandrei58@gmail.com', // adresa ta de email validă
    };

    try {
      const result = await this.ses.sendEmail(params).promise();
      console.log('Email trimis cu succes:', result);
      return result;
    } catch (error) {
      console.error('Eroare la trimiterea emailului:', error);
      throw error;
    }
  }
}
