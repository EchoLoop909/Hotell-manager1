package com.example.demo.model.response;

import com.example.demo.model.request.Pagination;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    int code = 1000;
    String message;
    T result;
    Pagination pagination;

    public ApiResponse(String requestSuccessful, Object data, long totalElements, int totalPages, HttpStatus status) {
    }

    // --- Static method cho thành công không có dữ liệu ---
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .code(1000)
                .message(message)
                .build();
    }

    // --- Static method cho thành công có dữ liệu ---
    public static <T> ApiResponse<T> success(String message, T result) {
        return ApiResponse.<T>builder()
                .code(1000)
                .message(message)
                .result(result)
                .build();
    }

    // --- Static method cho thất bại ---
    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    // Phương thức để tạo response thành công
    public static ApiResponse getResponses(Object data, long totalElements, int totalPages, HttpStatus status) {
        return new ApiResponse("Request successful", data, totalElements, totalPages, status);
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Constructor dùng cho phản hồi có phân trang
    public ApiResponse(String message, T result, Pagination pagination, HttpStatus status) {
        this.code = status.value();
        this.message = message;
        this.result = result;
        this.pagination = pagination;
    }

    // Static factory cho phản hồi phân trang
    public static <T> ApiResponse<T> paginated(String message, T data, Page<?> page, HttpStatus status) {
        Pagination pagination = Pagination.builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .isLast(page.isLast())
                .build();

        return new ApiResponse<>(message, data, pagination, status);
    }

}

