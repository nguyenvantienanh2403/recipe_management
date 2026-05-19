package com.N24_LTJavaNangCao.controllers;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

/**
 * API kiểm tra sức khỏe hệ thống (Health check endpoint)
 */
@Path("/")
public class GreetingResource {

    @GET
    @Path("recipe-app")
    @Produces(MediaType.APPLICATION_JSON)
    @PermitAll
    public Response hello() {
        return Response.ok(Map.of(
            "message", "Welcome to Recipe Management System!",
            "version", "2.0",
            "status", "running"
        )).build();
    }

    @GET
    @Path("")
    @PermitAll
    @Produces(MediaType.APPLICATION_JSON)
    public Response root() {
        return Response.ok(Map.of(
            "message", "Recipe Management API",
            "docs", "/swagger-ui"
        )).build();
    }
}
