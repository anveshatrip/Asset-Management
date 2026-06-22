package com.emppoc.pocemp.entity;

import com.emppoc.pocemp.enums.MaterialRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="materials")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Materials {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private MaterialRequest status;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;
    @ManyToOne
    @JoinColumn(name="tech_id")
    private UserData tech;
    @PrePersist
    public void prePersist() {
        this.status = MaterialRequest.PENDING;
    }
}
