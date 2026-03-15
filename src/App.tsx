import { useMemo, useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddStudent from "./components/AddStudent";
import ViewStudents from "./components/ViewStudents";
import Contact from "./components/Contact";
import Toast, { type ToastMessage } from "./components/Toast";
import "./App.css";

export interface Student {
  id: string;
  name: string;
  roll: string;
  course: string;
  email: string;
}

type NewStudent = Omit<Student, "id">;
type StudentPayload = Student | NewStudent;

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const navigate = useNavigate();

  const API_URL = "/api/students";

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
<<<<<<< HEAD
    } catch {
=======
    } catch (err) {
>>>>>>> 05a378957481b78786808b399cc5d43a236bac9b
      console.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showToast = (message: string, type: ToastMessage["type"] = "success") => {
    setToast({ message, type });
  };

  const saveStudent = async (student: StudentPayload) => {
    try {
      if ("id" in student) {
        const res = await fetch(`${API_URL}/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        });
        if (res.ok) {
          const updatedStudent = await res.json();
          setStudents((prev) =>
            prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
          );
          showToast("Student updated successfully.", "success");
          navigate("/view");
        } else {
          const errData = await res.json();
          showToast(errData.message || "Failed to update.", "error");
        }
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        });
        if (res.ok) {
          const newStudent = await res.json();
          setStudents((prev) => [newStudent, ...prev]);
          showToast("Student added successfully.", "success");
          navigate("/view");
        } else {
          const errData = await res.json();
          showToast(errData.message || "Failed to add.", "error");
        }
      }
<<<<<<< HEAD
    } catch {
=======
    } catch (err) {
>>>>>>> 05a378957481b78786808b399cc5d43a236bac9b
      showToast("Network error. Is the backend running?", "error");
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        showToast("Student deleted.", "success");
      } else {
        showToast("Failed to delete student.", "error");
      }
<<<<<<< HEAD
    } catch {
=======
    } catch (err) {
>>>>>>> 05a378957481b78786808b399cc5d43a236bac9b
      showToast("Network error. Is the backend running?", "error");
    }
  };

  const onEdit = (id: string) => navigate(`/edit/${id}`);

  const studentById = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((s) => map.set(s.id, s));
    return map;
  }, [students]);

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home students={students} />} />
          <Route path="/add" element={<AddStudent onSave={saveStudent} />} />
          <Route
            path="/edit/:id"
            element={
              <AddStudent
                onSave={saveStudent}
                studentLookup={(id) => studentById.get(id)}
              />
            }
          />
          <Route
            path="/view"
            element={
              <ViewStudents
                students={students}
                onDelete={deleteStudent}
                onEdit={onEdit}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  );
}

export default App;