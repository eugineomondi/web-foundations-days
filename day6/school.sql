-- =============================================
-- QuickNotes School Database
-- =============================================

-- ---------- 1. STUDENTS ----------
CREATE TABLE students (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    email    TEXT    NOT NULL UNIQUE,
    age      INTEGER
);

-- ---------- 2. COURSES ----------
CREATE TABLE courses (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    title    TEXT    NOT NULL UNIQUE,
    credits  INTEGER NOT NULL DEFAULT 3
);

-- ---------- 3. ENROLMENTS (join table) ----------
-- One student can enrol on many courses, one course can have many students.
-- The UNIQUE constraint prevents the same student enrolling twice on
-- the same course.
CREATE TABLE enrolments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id  INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    grade       TEXT,
    enrolled_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

-- =============================================
-- Sample data
-- =============================================

INSERT INTO students (name, email, age) VALUES
    ('Grace Wanjiru',  'grace@example.com', 21),
    ('Brian Otieno',   'brian@example.com', 23),
    ('Aisha Mohamed',  'aisha@example.com', 20);

INSERT INTO courses (title, credits) VALUES
    ('Web Foundations',    4),
    ('Databases 101',      3),
    ('JavaScript Basics',  4);

INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 'A'),   -- Grace  → Web Foundations
    (1, 2, 'B+'),  -- Grace  → Databases 101
    (2, 1, 'B'),   -- Brian  → Web Foundations
    (2, 3, 'A-'),  -- Brian  → JavaScript Basics
    (3, 2, NULL);  -- Aisha  → Databases 101 (not yet graded)

-- =============================================
-- Queries
-- =============================================

-- Q1: All courses for one student (by name)
--     Expect: Grace's two courses
SELECT c.title, c.credits, e.grade
FROM courses c
JOIN enrolments e ON e.course_id = c.id
JOIN students   s ON s.id = e.student_id
WHERE s.name = 'Grace Wanjiru'
ORDER BY c.title;

-- Q2: All students on one course
--     Expect: Brian and Grace (Web Foundations)
SELECT s.name, s.email, e.grade
FROM students s
JOIN enrolments e ON e.student_id = s.id
JOIN courses    c ON c.id = e.course_id
WHERE c.title = 'Web Foundations'
ORDER BY s.name;

-- Q3: Number of students per course
--     Expect: Web Foundations 2, Databases 101 2, JavaScript Basics 1
SELECT c.title,
       COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON e.course_id = c.id
GROUP BY c.id
ORDER BY student_count DESC, c.title;

-- Q4: Students who have no enrolments
--     Expect: (empty result — all three students are enrolled)
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON e.student_id = s.id
WHERE e.id IS NULL;

-- Q5: Update one enrolment's grade
--     Change Brian's Web Foundations grade from 'B' to 'A'
UPDATE enrolments
SET grade = 'A'
WHERE student_id = (SELECT id FROM students WHERE name = 'Brian Otieno')
  AND course_id  = (SELECT id FROM courses  WHERE title = 'Web Foundations');

-- Show the update worked
SELECT s.name, c.title, e.grade
FROM enrolments e
JOIN students s ON s.id = e.student_id
JOIN courses  c ON c.id = e.course_id
WHERE s.name = 'Brian Otieno' AND c.title = 'Web Foundations';