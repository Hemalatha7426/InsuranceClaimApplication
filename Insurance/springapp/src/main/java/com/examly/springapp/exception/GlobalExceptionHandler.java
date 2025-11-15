package com.examly.springapp.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("message", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<Map<String, String>> handleValidation(ValidationException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("message", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("message", ex.getBindingResult().getFieldError().getDefaultMessage());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
}

