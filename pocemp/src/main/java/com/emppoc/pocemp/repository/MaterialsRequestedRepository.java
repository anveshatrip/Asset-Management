package com.emppoc.pocemp.repository;

import com.emppoc.pocemp.entity.Materials;
import com.emppoc.pocemp.entity.Task;
import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.enums.MaterialRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialsRequestedRepository extends JpaRepository<Materials, Long> {
    List<Materials> findByTask(Task task);
    List<Materials> findByTech(UserData tech);
    List<Materials> findByStatus(MaterialRequest status);
}
