package com.emppoc.pocemp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String taskCode;
    private String taskName;
    private String taskDescription;
    private String status;
    private String assetName;
    private String ReportedBy;
    private String AssignedTo;
    private String assignedManager;
}
