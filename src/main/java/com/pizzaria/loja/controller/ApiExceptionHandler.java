package com.pizzaria.loja.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> tratar(IllegalArgumentException erro) {
        return ResponseEntity.badRequest().body(Map.of("erro", erro.getMessage()));
    }
}
