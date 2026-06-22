package com.emppoc.pocemp.controller;

import com.emppoc.pocemp.entity.Asset;
import com.emppoc.pocemp.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Asset> addAsset(@RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.addAsset(asset));
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAsset(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Asset>> search(@RequestParam String name) {
        return ResponseEntity.ok(assetService.searchByName(name));
    }
}