package com.example.demo.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Pagination {
    long totalElements;
    int totalPages;
    int currentPage;
    int pageSize;
    boolean isLast;
}