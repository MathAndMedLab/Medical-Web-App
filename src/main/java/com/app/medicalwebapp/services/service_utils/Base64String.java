package com.app.medicalwebapp.services.service_utils;

public class Base64String {
    private final String base64String;

    public Base64String(String base64String) {
        this.base64String = base64String;
    }
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result
                + ((base64String == null) ? 0 : base64String.hashCode());
        return result;
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Base64String other = (Base64String) obj;
        if (base64String == null) {
            return other.base64String == null;
        } else return base64String.equals(other.base64String);
    }
}
