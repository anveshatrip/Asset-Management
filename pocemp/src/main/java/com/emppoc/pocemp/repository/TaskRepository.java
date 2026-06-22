package com.emppoc.pocemp.repository;

import com.emppoc.pocemp.entity.Task;
import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByTaskCode(String taskCode);
    List<Task> findByUser(UserData user);
    List<Task> findByTech(UserData user);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByTaskNameContainingIgnoreCase(String TaskName);
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t WHERE t.manager = :manager OR t.manager IS NULL")
    List<Task> findByManagerOrManagerIsNull(@org.springframework.data.repository.query.Param("manager") UserData manager);
    List<Task> findByManager(UserData manager);
}
