package com.emppoc.pocemp.repository;

import com.emppoc.pocemp.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<UserData,Long> {
    Optional<UserData> findByUsername(String name);
}
