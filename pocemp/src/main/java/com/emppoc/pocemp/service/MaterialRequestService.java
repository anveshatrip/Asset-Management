package com.emppoc.pocemp.service;

import com.emppoc.pocemp.dto.MaterialRequestDTO;
import com.emppoc.pocemp.dto.MaterialRequestResponse;
import com.emppoc.pocemp.entity.Materials;
import com.emppoc.pocemp.entity.Task;
import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.enums.MaterialRequest;
import com.emppoc.pocemp.enums.TaskStatus;
import com.emppoc.pocemp.repository.MaterialsRequestedRepository;
import com.emppoc.pocemp.repository.TaskRepository;
import com.emppoc.pocemp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialRequestService {
    private final MaterialsRequestedRepository materialsRequestedRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private UserData getCurrentUser() {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("User not found"));
    }
    private MaterialRequestResponse toResponse(Materials materials) {
        return MaterialRequestResponse.builder()
                .id(materials.getId())
                .materialName(materials.getName())
                .description(materials.getDescription())
                .status(materials.getStatus().name())
                .taskCode(materials.getTask().getTaskCode())
                .techName(materials.getTech().getUsername())
                .build();
    }

    public MaterialRequestResponse requestMaterials(String taskCode, MaterialRequestDTO dto){
        UserData cuser=getCurrentUser();
        Task task=taskRepository.findByTaskCode(taskCode).orElseThrow(()-> new RuntimeException("Task not found"));

        if(!task.getTech().getId().equals(cuser.getId())){throw new RuntimeException("This task isn't assigned to you");}
        if(task.getStatus()!= TaskStatus.IN_PROGRESS){throw new RuntimeException("Task must be in progress to request materials");}

        Materials materials = Materials.builder()
                .name(dto.getMaterialName())
                .description(dto.getDescription())
                .task(task)
                .tech(cuser)
                .build();
        task.setStatus(TaskStatus.MATERIALS_REQUESTED);
        taskRepository.save(task);
        return toResponse(materialsRequestedRepository.save(materials));
    }

    public MaterialRequestResponse approveMaterials(Long requestId, boolean approve){
        UserData cuser = getCurrentUser();
        Materials request = materialsRequestedRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        Task task = request.getTask();

        if (task.getManager() == null || !task.getManager().getId().equals(cuser.getId())) {
            throw new RuntimeException("You are not the manager assigned to this task");
        }

        if (request.getStatus() != MaterialRequest.PENDING) {
            throw new RuntimeException("Request already resolved");
        }
        request.setStatus(approve
                ? MaterialRequest.APPROVED
                : MaterialRequest.REJECTED);

        task.setStatus(TaskStatus.IN_PROGRESS);
        taskRepository.save(task);
        return toResponse(materialsRequestedRepository.save(request));
    }
    public List<MaterialRequestResponse> getRequestsForTask(String taskCode) {
        Task task = taskRepository.findByTaskCode(taskCode)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return materialsRequestedRepository.findByTask(task)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
