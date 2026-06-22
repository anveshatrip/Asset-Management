package com.emppoc.pocemp.service;

import com.emppoc.pocemp.dto.CreateTaskRequest;
import com.emppoc.pocemp.dto.TaskResponse;
import com.emppoc.pocemp.entity.Asset;
import com.emppoc.pocemp.entity.Task;
import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.enums.Role;
import com.emppoc.pocemp.enums.TaskStatus;
import com.emppoc.pocemp.repository.AssetRepository;
import com.emppoc.pocemp.repository.TaskRepository;
import com.emppoc.pocemp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    private UserData getCurrentUser() {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("User not found"));
    }
    private String mapStatusForUser(TaskStatus status, Role role) {
        String mappedStatus;
        switch (status) {
            case TASK_REPORTED:
                mappedStatus = "REPORTED";
                break;
            case TASK_ASSIGNED_TO_TECHNICIAN:
                mappedStatus = "ASSIGNED";
                break;
            case IN_PROGRESS:
                mappedStatus = "IN_PROGRESS";
                break;
            case MATERIALS_REQUESTED:
                mappedStatus = "PENDING_MATERIAL_APPROVAL";
                break;
            case MATERIALS_APPROVED:
                mappedStatus = "IN_PROGRESS";
                break;
            case TECHNICIAN_FINISHED:
                mappedStatus = "COMPLETED_PENDING_CONFIRMATION";
                break;
            case COMPLETED:
                mappedStatus = "COMPLETED";
                break;
            case CLOSED:
                mappedStatus = "CLOSED";
                break;
            default:
                mappedStatus = status.name();
        }

        if (role == Role.USER) {
            if (mappedStatus.equals("PENDING_MATERIAL_APPROVAL") || mappedStatus.equals("COMPLETED_PENDING_CONFIRMATION") || mappedStatus.equals("ASSIGNED")) {
                mappedStatus = "IN_PROGRESS";
            }
        }

        return mappedStatus;
    }

    private TaskResponse toResponse(Task task) {
        UserData currentUser = getCurrentUser();
        return TaskResponse.builder()
                .id(task.getId())
                .taskCode(task.getTaskCode())
                .taskName(task.getTaskName())
                .taskDescription(task.getTaskDescription())
                .status(mapStatusForUser(task.getStatus(), currentUser.getRole()))
                .assetName(task.getAsset().getName())
                .ReportedBy(task.getUser().getUsername())
                .AssignedTo(task.getTech()!=null?task.getTech().getUsername():"Unassigned")
                .assignedManager(task.getManager()!=null?task.getManager().getUsername():null)
                .build();
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        UserData cuser=getCurrentUser();
        Asset asset;
        if (request.getAssetId() != null) {
            asset = assetRepository.findById(request.getAssetId()).orElseThrow(()->new RuntimeException("Asset not found"));
        } else if (request.getAssetName() != null && !request.getAssetName().trim().isEmpty()) {
            asset = assetRepository.findByName(request.getAssetName().trim())
                    .orElseGet(() -> {
                        Asset newAsset = Asset.builder()
                                .name(request.getAssetName().trim())
                                .description("Auto-created asset")
                                .build();
                        return assetRepository.save(newAsset);
                    });
        } else {
            throw new RuntimeException("Asset ID or Asset Name must be provided");
        }
        Task task=Task.builder()
                .taskName(request.getTaskName())
                .taskDescription(request.getDescription())
                .asset(asset)
                .user(cuser)
                .build();
        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getMyTasks() {
        UserData cuser=getCurrentUser();
        List<Task> tasks;
        if(cuser.getRole()== Role.MANAGER){
            tasks=taskRepository.findByManagerOrManagerIsNull(cuser);
        }else if(cuser.getRole()==Role.TECHNICIAN){
            tasks=taskRepository.findByTech(cuser);
        }else{
            tasks=taskRepository.findByUser(cuser);
        }
        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse assignTask(String taskCode,String TechName) {
        Task task=taskRepository.findByTaskCode(taskCode).orElseThrow(()->new RuntimeException("Task not found"));
        if(task.getStatus()!= TaskStatus.TASK_REPORTED){
            throw new RuntimeException("Task can only be assigned when reported");
        }
        UserData tech=userRepository.findByUsername(TechName).orElseThrow(()->new RuntimeException("Technician not found"));
        if(tech.getRole()!= Role.TECHNICIAN){
                throw new RuntimeException("Tasks can only be assigned to technician");
        }
        task.setTech(tech);
        task.setManager(getCurrentUser());
        task.setStatus(TaskStatus.TASK_ASSIGNED_TO_TECHNICIAN);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse TaskPick(String taskCode) {
        UserData cuser=getCurrentUser();
        Task task=taskRepository.findByTaskCode(taskCode).orElseThrow(()->new RuntimeException("Task not found"));
        if(task.getTech() == null || !(task.getTech().getId().equals(cuser.getId()))){
            throw new RuntimeException("Task not accessible to you");
        }
        if(task.getStatus()!= TaskStatus.TASK_ASSIGNED_TO_TECHNICIAN){
            throw new RuntimeException("Task must be assigned to you");
        }
        task.setStatus(TaskStatus.IN_PROGRESS);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse TaskTech(String taskCode) {
        UserData cuser=getCurrentUser();
        Task task=taskRepository.findByTaskCode(taskCode).orElseThrow(()->new RuntimeException("Task not found"));
        if(task.getTech() == null || !(task.getTech().getId().equals(cuser.getId()))){
            throw new RuntimeException("Task not accessible to you");
        }
        if(task.getStatus()== TaskStatus.MATERIALS_REQUESTED){
            throw new RuntimeException("Materials are still not approved");
        }
        task.setStatus(TaskStatus.TECHNICIAN_FINISHED);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse TaskDone(String taskCode) {
        UserData cuser=getCurrentUser();
        Task task=taskRepository.findByTaskCode(taskCode).orElseThrow(()->new RuntimeException("Task not found"));
        if(task.getStatus()!= TaskStatus.TECHNICIAN_FINISHED){
            throw new RuntimeException("Task must be finished by technician first");
        }
        task.setStatus(TaskStatus.COMPLETED);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse verifyTaskCompletion(String taskCode) {
        UserData cuser = getCurrentUser();
        Task task = taskRepository.findByTaskCode(taskCode).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getId().equals(cuser.getId())) {
            throw new RuntimeException("Task not accessible to you");
        }
        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new RuntimeException("Task must be completed first");
        }
        task.setStatus(TaskStatus.CLOSED);
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse restartTask(String taskCode) {
        UserData cuser = getCurrentUser();
        Task task = taskRepository.findByTaskCode(taskCode).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getId().equals(cuser.getId())) {
            throw new RuntimeException("Task not accessible to you");
        }
        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new RuntimeException("Task must be completed first");
        }
        task.setTech(null);
        // User requested to keep the manager the same
        task.setStatus(TaskStatus.TASK_REPORTED);
        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> searchByTitle(String title) {
        return getMyTasks().stream()
                .filter(t -> t.getTaskName().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<TaskResponse> filterByStatus(String status) {
        return getMyTasks().stream()
                .filter(t -> t.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }
    public TaskResponse getTaskByCode(String taskCode) {
        Task task = taskRepository.findByTaskCode(taskCode)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return toResponse(task);
    }
}
