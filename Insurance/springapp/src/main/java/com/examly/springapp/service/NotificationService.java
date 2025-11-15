package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendClaimStatusEmail(String to, String claimId, String status, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject("Insurance Claim Update - Claim #" + claimId);
        mailMessage.setText("Your claim #" + claimId + " has been " + status + ".\n\n" + message);

        mailSender.send(mailMessage);
    }
}
