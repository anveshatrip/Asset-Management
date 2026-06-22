package com.emppoc.pocemp.service;

import com.emppoc.pocemp.entity.Asset;
import com.emppoc.pocemp.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }
    public Asset getAssetById(Long id) {
        return assetRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));
    }
    public List<Asset> searchByName(String name) {
        return assetRepository.findByNameContainingIgnoreCase(name);
    }
}

