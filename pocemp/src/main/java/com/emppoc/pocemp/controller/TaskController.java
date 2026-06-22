package com.emppoc.pocemp.controller;

import com.emppoc.pocemp.dto.CreateTaskRequest;
import com.emppoc.pocemp.dto.TaskResponse;
import com.emppoc.pocemp.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks() {
        return ResponseEntity.ok(taskService.getMyTasks());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('AUTH')")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{taskCode}")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'TECHNICIAN', 'AUTH')")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.getTaskByCode(taskCode));
    }

    @PutMapping("/{taskCode}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable String taskCode,
            @RequestParam String technicianUsername) {
        return ResponseEntity.ok(taskService.assignTask(taskCode, technicianUsername));
    }

    @PutMapping("/{taskCode}/pickup")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TaskResponse> pickUp(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.TaskPick(taskCode));
    }

    @PutMapping("/{taskCode}/done")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TaskResponse> markDone(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.TaskTech(taskCode));
    }

    @PutMapping("/{taskCode}/confirm")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> confirm(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.TaskDone(taskCode));
    }

    @PutMapping("/{taskCode}/verify")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TaskResponse> verifyTaskCompletion(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.verifyTaskCompletion(taskCode));
    }

    @PutMapping("/{taskCode}/restart")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TaskResponse> restartTask(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.restartTask(taskCode));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER', 'TECHNICIAN')")
    public ResponseEntity<List<TaskResponse>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status) {
        if (title != null) {
            return ResponseEntity.ok(taskService.searchByTitle(title));
        }
        if (status != null) {
            return ResponseEntity.ok(taskService.filterByStatus(status));
        }
        return ResponseEntity.ok(taskService.getMyTasks());
    }
}
