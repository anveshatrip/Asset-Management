package com.emppoc.pocemp.dto;//Security

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResp {
    private String token;
    private String role;
    private String username;
}
