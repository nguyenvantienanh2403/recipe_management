package com.N24_LTJavaNangCao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Tên không được để trống")
    public String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    public String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    public String password;
}
