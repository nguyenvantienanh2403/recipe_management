package com.N24_LTJavaNangCao.exception;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;

/**
 * Global Exception Handler - bắt tất cả exception và trả về JSON chuẩn
 * Tự động xử lý: AppException, ConstraintViolation, và RuntimeException
 */
@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        // 1. Xử lý AppException (lỗi nghiệp vụ do ta throw)
        if (exception instanceof AppException appEx) {
            return Response.status(appEx.status)
                    .entity(Map.of(
                            "error", true,
                            "message", appEx.getMessage(),
                            "status", appEx.status
                    ))
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        // 2. Xử lý lỗi validation (Bean Validation)
        if (exception instanceof ConstraintViolationException cve) {
            String message = cve.getConstraintViolations().stream()
                    .map(v -> v.getMessage())
                    .reduce((a, b) -> a + "; " + b)
                    .orElse("Dữ liệu không hợp lệ");

            return Response.status(400)
                    .entity(Map.of(
                            "error", true,
                            "message", message,
                            "status", 400
                    ))
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        // 3. Xử lý lỗi không mong muốn (500)
        return Response.status(500)
                .entity(Map.of(
                        "error", true,
                        "message", "Lỗi hệ thống: " + exception.getMessage(),
                        "status", 500
                ))
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
