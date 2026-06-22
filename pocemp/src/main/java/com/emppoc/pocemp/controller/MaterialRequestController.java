package com.emppoc.pocemp.controller;

import com.emppoc.pocemp.dto.MaterialRequestDTO;
import com.emppoc.pocemp.dto.MaterialRequestResponse;
import com.emppoc.pocemp.service.MaterialRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
public class MaterialRequestController {

    private final MaterialRequestService materialRequestService;

    @PostMapping("/{taskCode}/request")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<MaterialRequestResponse> requestMaterials(@PathVariable String taskCode, @RequestBody MaterialRequestDTO dto) {
        return ResponseEntity.ok(
                materialRequestService.requestMaterials(taskCode, dto));
    }

    @PutMapping("/{requestId}/respond")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MaterialRequestResponse> respond(@PathVariable Long requestId, @RequestParam boolean approve) {
        return ResponseEntity.ok(
                materialRequestService.approveMaterials(requestId, approve));
    }

    @GetMapping("/{taskCode}")
    public ResponseEntity<List<MaterialRequestResponse>> getForTask(@PathVariable String taskCode) {
        return ResponseEntity.ok(materialRequestService.getRequestsForTask(taskCode));
    }
}
