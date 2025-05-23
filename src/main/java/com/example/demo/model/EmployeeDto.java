package com.example.demo.model;

import com.example.demo.model.entity.Employee;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor          // sinh constructor không-arg cho Jackson
@AllArgsConstructor         // sinh constructor tất cả các trường (nếu bạn cần)
public class EmployeeDto {
    @JsonProperty("id")
    private Integer employeeId;   // thêm trường này
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

//    public EmployeeDto(Integer employeeId, String name, String email, Employee.EmployeeRole employeeRole) {
//        this.name = name;
//        this.email = email;
//        this.employeeRole = employeeRole.name();  // convert Enum to String
//    }

}
