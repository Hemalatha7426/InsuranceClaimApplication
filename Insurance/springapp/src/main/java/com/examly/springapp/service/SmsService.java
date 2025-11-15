package com.examly.springapp.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private final String ACCOUNT_SID = "your_twilio_sid";
    private final String AUTH_TOKEN = "your_twilio_auth_token";
    private final String FROM_NUMBER = "+1234567890"; // Twilio phone number

    public SmsService() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public void sendSms(String to, String body) {
        Message.creator(new com.twilio.type.PhoneNumber(to),
                new com.twilio.type.PhoneNumber(FROM_NUMBER),
                body).create();
    }
}
