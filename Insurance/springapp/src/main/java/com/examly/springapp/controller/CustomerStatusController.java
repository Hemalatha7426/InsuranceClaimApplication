package com.examly.springapp.controller;

import com.examly.springapp.dto.CustomerStatusDto;
import com.examly.springapp.service.CustomerStatusService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/customers/status")
public class CustomerStatusController {

    private final CustomerStatusService statusService;

    public CustomerStatusController(CustomerStatusService statusService) {
        this.statusService = statusService;
    }

    // ✅ Get logged-in customer's status
    @GetMapping("/me/{customerId}")
    public CustomerStatusDto getMyStatus(@PathVariable Long customerId) {
        return statusService.getStatusByCustomerId(customerId);
    }
}
