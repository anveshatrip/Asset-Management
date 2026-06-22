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
				// PostgreSQL: Ensure the status column is VARCHAR so it can hold all enum values.
				// With @Enumerated(EnumType.STRING), Hibernate stores enums as strings.
				// This ALTER ensures the column type is compatible if it was previously constrained.
				jdbcTemplate.execute(
					"DO $$ BEGIN " +
					"  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'status') THEN " +
					"    ALTER TABLE tasks ALTER COLUMN status TYPE VARCHAR(255); " +
					"  END IF; " +
					"END $$"
				);
				System.out.println("ENUM ALTERED SUCCESSFULLY");
			} catch (Exception e) {
				System.out.println("Failed to alter ENUM: " + e.getMessage());
			}
		};
	}
}
