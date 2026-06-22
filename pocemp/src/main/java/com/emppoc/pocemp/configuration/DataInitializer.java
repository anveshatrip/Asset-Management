package com.emppoc.pocemp.configuration;//Security

import com.emppoc.pocemp.entity.UserData;
import com.emppoc.pocemp.enums.Role;
import com.emppoc.pocemp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            UserData admin = UserData.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.AUTH)
                    .build();
            userRepository.save(admin);
            System.out.println("Default AUTH user 'admin' created with password 'admin'");
        }
    }
}
