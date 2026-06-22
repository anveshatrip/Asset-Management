package com.emppoc.pocemp.dto;

import lombok.Data;

@Data
public class CreateTaskRequest {
    private String taskName;
    private String description;
    private Long assetId;
    private String assetName;
}
