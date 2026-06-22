package com.emppoc.pocemp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="assets")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Asset
{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String name;
    private String description;
}
