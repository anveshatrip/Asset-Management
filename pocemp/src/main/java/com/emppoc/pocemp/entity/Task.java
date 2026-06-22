package com.emppoc.pocemp.entity;

import com.emppoc.pocemp.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name="tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String taskCode;
    private String taskName;
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name="asset_id")
    private Asset asset;

    @ManyToOne
    @JoinColumn(name="user_id")
    private UserData user;

    @ManyToOne
    @JoinColumn(name="tech_id")
    private UserData tech;

    @ManyToOne
    @JoinColumn(name="manager_id")
    private UserData manager;

    @PrePersist
    public void prePersist() {
        this.status=TaskStatus.TASK_REPORTED;
        if(this.taskCode == null) {
            StringBuilder sb = new StringBuilder(3);
            for(int i = 0; i < 3; i++) {
                sb.append((char)('A' + (int)(Math.random() * 26)));
            }
            this.taskCode = "TSK-"+(int)(Math.floor(Math.random() * 9000) + 1000)+"-"+sb.toString();
        }
    }
}
