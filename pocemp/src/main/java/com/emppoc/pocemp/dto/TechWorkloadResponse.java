package com.emppoc.pocemp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TechWorkloadResponse {
    private String username;
    private int activeTaskCount;
}
