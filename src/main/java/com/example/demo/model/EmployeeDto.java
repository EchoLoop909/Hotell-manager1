package com.example.demo.model;

import com.example.demo.model.entity.Employee;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    @JsonProperty("id")
    private Integer employeeId;
    private String name;
    private String email;
    private String password;

    @JsonProperty("employee_role")
    private String employeeRole;

    public EmployeeDto(int employeeId, String name, String email, String name1) {
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.employeeRole = name1;
    }
}
