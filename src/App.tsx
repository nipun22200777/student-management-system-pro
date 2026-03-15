import { useMemo, useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddStudent from "./components/AddStudent";
import ViewStudents from "./components/ViewStudents";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import Toast, { type ToastMessage } from "./components/Toast";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export interface Student {
  id: string;
  name: string;
  roll: string;
  course: string;
  email: string;
  userId: string;
}

type NewStudent = Omit<Student, "id" | "userId">;
type StudentPayload = Student | NewStudent;

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const API_URL = "/api/students";

  const fetchStudents = async () => {
    if (!user) return;
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else if (res.status === 401) {
         // unauthorized possibly token expired
         console.error("Unauthorized to fetch students");
      }
    } catch {
      console.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const showToast = (message: string, type: ToastMessage["type"] = "success") => {
    setToast({ message, type });
  };

  const saveStudent = async (student: StudentPayload) => {
    if (!user) return;
    try {
      if ("id" in student) {
        const res = await fetch(`${API_URL}/${student.id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
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
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
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
    } catch {
      showToast("Network error. Is the backend running?", "error");
    }
  };

  const deleteStudent = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        showToast("Student deleted.", "success");
      } else {
        const errData = await res.json();
        showToast(errData.message || "Failed to delete student.", "error");
      }
    } catch {
      showToast("Network error. Is the backend running?", "error");
    }
  };

  const onEdit = (id: string) => navigate(`/edit/${id}`);

  const studentById = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((s) => map.set(s.id, s));
    return map;
  }, [students]);

  if (isLoading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={user ? <Home students={students} /> : <Navigate to="/login" />} />
          <Route path="/add" element={user ? <AddStudent onSave={saveStudent} /> : <Navigate to="/login" />} />
          <Route
            path="/edit/:id"
            element={
              user ? (
                <AddStudent
                  onSave={saveStudent}
                  studentLookup={(id) => studentById.get(id)}
                />
              ) : <Navigate to="/login" />
            }
          />
          <Route
            path="/view"
            element={
              user ? (
                <ViewStudents
                  students={students}
                  onDelete={deleteStudent}
                  onEdit={onEdit}
                />
              ) : <Navigate to="/login" />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </div>

      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  );
}

export default App;