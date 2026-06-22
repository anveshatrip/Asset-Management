package com.emppoc.pocemp.service;//Security

import com.emppoc.pocemp.dto.AuthReq;
import com.emppoc.pocemp.dto.AuthResp;
import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.repository.UserRepository;
import com.emppoc.pocemp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final com.emppoc.pocemp.repository.TaskRepository taskRepository;
    private final com.emppoc.pocemp.repository.MaterialsRequestedRepository materialsRequestedRepository;

    public String register(AuthReq request){
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("Username is already in use");
        }
        UserData user = UserData.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(com.emppoc.pocemp.enums.Role.USER)
                .build();
        userRepository.save(user);
        return "User registered successfully";
    }
    public AuthResp login(AuthReq request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserData  user = userRepository.findByUsername(request.getUsername()).
                orElseThrow(()-> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResp(token, user.getRole().name(),user.getUsername());
    }

    public java.util.List<com.emppoc.pocemp.dto.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> com.emppoc.pocemp.dto.UserResponse.builder()
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    public String changeUserRole(String username, com.emppoc.pocemp.enums.Role newRole) {
        UserData user = userRepository.findByUsername(username)                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        userRepository.save(user);
        return "Role updated successfully";
    }

    @org.springframework.transaction.annotation.Transactional
    public String deleteUser(String username) {
        UserData user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == com.emppoc.pocemp.enums.Role.USER) {
            java.util.List<com.emppoc.pocemp.entity.Task> userTasks = taskRepository.findByUser(user);
            taskRepository.deleteAll(userTasks);
        } else if (user.getRole() == com.emppoc.pocemp.enums.Role.TECHNICIAN) {
            java.util.List<com.emppoc.pocemp.entity.Task> techTasks = taskRepository.findByTech(user);
            for(com.emppoc.pocemp.entity.Task t : techTasks) { t.setTech(null); taskRepository.save(t); }
            java.util.List<com.emppoc.pocemp.entity.Materials> techMats = materialsRequestedRepository.findByTech(user);
            for(com.emppoc.pocemp.entity.Materials m : techMats) { m.setTech(null); materialsRequestedRepository.save(m); }
        } else if (user.getRole() == com.emppoc.pocemp.enums.Role.MANAGER) {
            java.util.List<com.emppoc.pocemp.entity.Task> mgrTasks = taskRepository.findByManager(user);
            for(com.emppoc.pocemp.entity.Task t : mgrTasks) { t.setManager(null); taskRepository.save(t); }
        }

        userRepository.delete(user);
        return "User deleted successfully";
    }

    public java.util.List<com.emppoc.pocemp.dto.TechWorkloadResponse> getTechnicianWorkloads() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.emppoc.pocemp.enums.Role.TECHNICIAN)
                .map(tech -> {
                    long activeTasks = taskRepository.findByTech(tech).stream()
                            .filter(t -> t.getStatus() == com.emppoc.pocemp.enums.TaskStatus.IN_PROGRESS || 
                                         t.getStatus() == com.emppoc.pocemp.enums.TaskStatus.MATERIALS_REQUESTED ||
                                         t.getStatus() == com.emppoc.pocemp.enums.TaskStatus.MATERIALS_APPROVED ||
                                         t.getStatus() == com.emppoc.pocemp.enums.TaskStatus.TASK_ASSIGNED_TO_TECHNICIAN)
                            .count();
                    return com.emppoc.pocemp.dto.TechWorkloadResponse.builder()
                            .username(tech.getUsername())
                            .activeTaskCount((int)activeTasks)
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
