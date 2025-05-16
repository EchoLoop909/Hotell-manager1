package com.example.demo.model;

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
    private String employee_role;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmployee_role() { return employee_role; }
    public void setEmployee_role(String employee_role) { this.employee_role = employee_role; }
}
