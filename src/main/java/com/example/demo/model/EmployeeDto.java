package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class EmployeeDto {
    private String name;
    private String email;
    private String password;
    @JsonProperty("employee_role")
    private String employeeRole;
   }
