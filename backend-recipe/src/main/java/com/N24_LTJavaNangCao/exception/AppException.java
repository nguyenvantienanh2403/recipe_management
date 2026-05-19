package com.N24_LTJavaNangCao.exception;

/**
 * Exception dùng chung cho các lỗi nghiệp vụ
 * Kết hợp với GlobalExceptionHandler để trả response chuẩn
 */
public class AppException extends RuntimeException {
    public int status;

    public AppException(String message, int status) {
        super(message);
        this.status = status;
    }

    // Factory methods cho các lỗi phổ biến
    public static AppException notFound(String message) {
        return new AppException(message, 404);
    }

    public static AppException badRequest(String message) {
        return new AppException(message, 400);
    }

    public static AppException unauthorized(String message) {
        return new AppException(message, 401);
    }

    public static AppException forbidden(String message) {
        return new AppException(message, 403);
    }

    public static AppException conflict(String message) {
        return new AppException(message, 409);
    }
}
