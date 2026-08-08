package com.bank.dispute.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ClaudeConfig {
    
    @Value("${app.claude.api-key}")
    private String apiKey;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}