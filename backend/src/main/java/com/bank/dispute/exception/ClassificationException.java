package com.bank.dispute.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ClassificationException extends RuntimeException {
    public ClassificationException(String message) {
        super(message);
    }
    
    public ClassificationException(String message, Throwable cause) {
        super(message, cause);
    }
}