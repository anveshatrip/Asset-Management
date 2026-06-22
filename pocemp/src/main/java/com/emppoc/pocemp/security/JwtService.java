package com.emppoc.pocemp.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(String username,String role){
        return Jwts.builder()
                .setSubject(username)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600*1000))
                .signWith(getSigningKey())
                .compact();
    }
    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String getUsernameFromToken(String token){
        return getClaims(token).getSubject();
    }
    public String getRoleFromToken(String token){
        return getClaims(token).get("role",String.class);
    }
    public boolean isValidToken(String token){
        try{
            getClaims(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    private Claims getClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
