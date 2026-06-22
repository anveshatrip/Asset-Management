package com.emppoc.pocemp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MaterialRequestResponse {
    private Long id;
    private String materialName;
    private String description;
    private String status;
    private String taskCode;
    private String techName;

}
