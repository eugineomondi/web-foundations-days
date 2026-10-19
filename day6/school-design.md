# School Database — Design Notes

## Tables

### `students`
Stores one row per student. Each row has a unique `id` (primary key),
a `name`, a **unique** `email` (no two students can share an email),
and an optional `age`.

### `courses`
Stores one row per course. Each row has a unique `id` (primary key),
a **unique** `title`, and a default `credits` value of 3.

### `enrolments`
The **join table** between `students` and `courses`. Each row records
one enrolment: which student, which course, the grade (nullable,
because a course may not be graded yet), and the timestamp.
It has foreign keys pointing at `students(id)` and `courses(id)`,
both with `ON DELETE CASCADE`.

---

## Relationships

- **`students` → `enrolments` is one-to-many.** One student can have
  many enrolment rows, but each enrolment row belongs to exactly one
  student.
- **`courses` → `enrolments` is one-to-many.** One course can appear in
  many enrolment rows, but each enrolment refers to exactly one course.
- **`students` ↔ `courses` is many-to-many.** A student can take many
  courses, and a course can have many students.

### Why a join table is needed

A many-to-many relationship cannot be modelled with two tables alone —
there is nowhere to store the pairings without repeating data. The
`enrolments` table holds one row per pairing and also carries extra
data specific to the pairing, such as the `grade` and the
`enrolled_at` timestamp. This keeps `students` and `courses` free of
duplicated information and makes it easy to add or remove enrolments
without touching either side.

The `UNIQUE (student_id, course_id)` constraint on `enrolments`
prevents the same student from being enrolled on the same course twice.

---

## Index I would add

```sql
CREATE INDEX idx_enrolments_student ON enrolments(student_id);