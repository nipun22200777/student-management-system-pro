import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import type { Student } from "../App";

export interface AddStudentProps {
  onSave: (student: Omit<Student, "id" | "userId"> | Student) => void;
  studentLookup?: (id: string) => Student | undefined;
}

const COURSE_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Data Science",
  "Mathematics",
];

function AddStudent({ onSave, studentLookup }: AddStudentProps) {
  const { id } = useParams<{ id: string }>();
  const editingStudent = id ? studentLookup?.(id) : undefined;

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setRoll(editingStudent.roll);
      setCourse(editingStudent.course);
      setEmail(editingStudent.email);
    }
  }, [editingStudent]);

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!roll.trim()) return "Roll number is required.";
    if (!course) return "Please select a course.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);

    const studentPayload = editingStudent
      ? { id: editingStudent.id, name: name.trim(), roll: roll.trim(), course, email: email.trim(), userId: editingStudent.userId }
      : { name: name.trim(), roll: roll.trim(), course, email: email.trim() };

    await onSave(studentPayload);
    setLoading(false);

    if (!editingStudent) {
      setName("");
      setRoll("");
      setCourse("");
      setEmail("");
    }
  };

  return (
    <div className="card form-card">
      <div className="form-header">
        <h2>{editingStudent ? "✏️ Edit Student" : "➕ Add New Student"}</h2>
        <p>{editingStudent ? "Update the details below." : "Fill in the details to register a new student."}</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <input
              id="student-name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="student-roll"
              placeholder="Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <select
              id="student-course"
              className="filter-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">Course</option>
              {COURSE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              id="student-email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : editingStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;