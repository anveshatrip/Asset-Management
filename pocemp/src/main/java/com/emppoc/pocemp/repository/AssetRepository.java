package com.emppoc.pocemp.repository;

import com.emppoc.pocemp.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset,Long> {
    List<Asset> findByNameContainingIgnoreCase(String name);
    java.util.Optional<Asset> findByName(String name);
}
