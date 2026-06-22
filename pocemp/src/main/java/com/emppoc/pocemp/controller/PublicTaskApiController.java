package com.emppoc.pocemp.controller;

import com.emppoc.pocemp.dto.CreateTaskRequest;
import com.emppoc.pocemp.dto.TaskResponse;
import com.emppoc.pocemp.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class PublicTaskApiController {

    private final TaskService taskService;

    // Fetch task details by taskCode
    @GetMapping("/{taskCode}")
    public ResponseEntity<TaskResponse> getTaskByCode(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(taskService.getTaskByCode(taskCode));
    }

    // Create a task via REST API
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }
}
