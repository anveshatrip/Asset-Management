package com.emppoc.pocemp.dto;//Security

import com.emppoc.pocemp.enums.Role;
import lombok.Data;

@Data

public class AuthReq {
    private String username;
    private String password;
    private Role role;
}
