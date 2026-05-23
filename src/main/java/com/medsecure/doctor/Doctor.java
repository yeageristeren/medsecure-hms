package com.medsecure.doctor;

import com.medsecure.common.Auditable;
import com.medsecure.user.AppUser;
import com.medsecure.appointment.Appointment;
import com.medsecure.department.Department;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@SQLDelete(sql = "update doctor set deleted = true where id =?")
@SQLRestriction("deleted = false")
public class Doctor extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToOne
    @MapsId
    @ToString.Exclude
    private AppUser user;

    @Column(length = 100)
    @ToString.Exclude
    private String specialization;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToMany(mappedBy = "doctors")
    @ToString.Exclude
    private Set<Department> departments = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    @ToString.Exclude
    private List<Appointment> appointments = new ArrayList<>();

}
