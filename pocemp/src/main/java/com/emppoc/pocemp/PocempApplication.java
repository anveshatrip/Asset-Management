package com.emppoc.pocemp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PocempApplication {

	public static void main(String[] args) {
		SpringApplication.run(PocempApplication.class, args);
	}

	@Bean
	CommandLineRunner alterEnum(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE tasks MODIFY COLUMN status ENUM('TASK_REPORTED', 'TASK_ASSIGNED_TO_TECHNICIAN', 'IN_PROGRESS', 'MATERIALS_REQUESTED', 'MATERIALS_APPROVED', 'TECHNICIAN_FINISHED', 'COMPLETED', 'CLOSED')");
				System.out.println("ENUM ALTERED SUCCESSFULLY");
			} catch (Exception e) {
				System.out.println("Failed to alter ENUM: " + e.getMessage());
			}
		};
	}
}
