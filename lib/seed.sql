-- Drop tables if they exist
DROP TABLE IF EXISTS course_enrollments;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course_enrollments table
CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    progress INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Insert sample data
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', 'hashed_password', 'instructor'),
('Jane Smith', 'jane@example.com', 'hashed_password', 'student'),
('Alice Johnson', 'alice@example.com', 'hashed_password', 'student');

INSERT INTO courses (title, description, instructor_id) VALUES
('Introduction to JavaScript', 'Learn the basics of JavaScript programming', 1),
('Advanced React Techniques', 'Master advanced concepts in React development', 1);

INSERT INTO lessons (course_id, title, content, order_index) VALUES
(1, 'Variables and Data Types', 'Content for lesson 1', 1),
(1, 'Functions and Scope', 'Content for lesson 2', 2),
(1, 'Arrays and Objects', 'Content for lesson 3', 3),
(2, 'Hooks in Depth', 'Content for lesson 1', 1),
(2, 'State Management with Context', 'Content for lesson 2', 2);

INSERT INTO course_enrollments (user_id, course_id, progress) VALUES
(2, 1, 33),
(2, 2, 0),
(3, 1, 66);