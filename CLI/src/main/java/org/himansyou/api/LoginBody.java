package org.himansyou.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginBody {
    private final String email;
    private final String password;

    @JsonCreator
    public LoginBody(
        @JsonProperty("email") String email,
        @JsonProperty("password") String password
    ) {
        this.email = email;
        this.password = password;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    @JsonProperty("password")
    public String getPassword() {
        return password;
    }
}
