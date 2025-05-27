export type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type SetError = (message: string) => void;

export const validateForm = (
    setError?: SetError,
    formData?: FormData
): true | string => {
    if (!formData) return "No form data provided.";

    const { name, email, password, confirmPassword } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#-_/|\\])[A-Za-z\d@$!%*?&#-_/|\\]{8,}$/;

    if (!emailRegex.test(email)) {
        const error = "Please enter a valid email address (must include '@').";
        setError?.(error);
        return error;
    }

    if (!passwordRegex.test(password)) {
        const error =
            "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character.";
        setError?.(error);
        return error;
    }

    if (password !== confirmPassword) {
        const error = "Passwords must match.";
        setError?.(error);
        return error;
    }

    if (!name || name.length <= 5) {
        const error = "Name must be longer than 5 characters.";
        setError?.(error);
        return error;
    }

    return true;
};