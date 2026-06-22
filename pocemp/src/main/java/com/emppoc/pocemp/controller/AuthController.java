package com.emppoc.pocemp.controller;//Security

import com.emppoc.pocemp.dto.AuthReq;
import com.emppoc.pocemp.dto.AuthResp;
import com.emppoc.pocemp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthReq request){
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResp> login(@RequestBody AuthReq request){
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('AUTH')")
    public ResponseEntity<java.util.List<com.emppoc.pocemp.dto.UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @DeleteMapping("/users/{username}")
    @PreAuthorize("hasRole('AUTH')")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        return ResponseEntity.ok(authService.deleteUser(username));
    }

    @org.springframework.web.bind.annotation.PutMapping("/users/{username}/role")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('AUTH')")
    public ResponseEntity<String> changeRole(
            @org.springframework.web.bind.annotation.PathVariable String username,
            @org.springframework.web.bind.annotation.RequestParam com.emppoc.pocemp.enums.Role role) {
        return ResponseEntity.ok(authService.changeUserRole(username, role));
    }

    @GetMapping("/technicians/workload")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<java.util.List<com.emppoc.pocemp.dto.TechWorkloadResponse>> getTechnicianWorkloads() {
        return ResponseEntity.ok(authService.getTechnicianWorkloads());
    }
}
