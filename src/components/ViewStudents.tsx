import { useState, useMemo } from "react";
import type { Student } from "../App";
import { useAuth } from "../context/AuthContext";

interface Props {
  students: Student[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

function ViewStudents({ students, onDelete, onEdit }: Props) {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const { user } = useAuth();

  const courses = useMemo(() => {
    const all = students.map((s) => s.course);
    return ["All", ...Array.from(new Set(all))];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesCourse = courseFilter === "All" || s.course === courseFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }, [students, search, courseFilter]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="card">
      <h2>Student Records</h2>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="student-search"
            placeholder="Search by name, roll, email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          id="course-filter"
          className="filter-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Courses" : c}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {search || courseFilter !== "All" ? (
        <p className="results-info">
          Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> students
        </p>
      ) : null}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>{students.length === 0 ? "No students yet" : "No students match your search"}</h3>
          <p>{students.length === 0
            ? "Click 'Add Student' to add your first student record."
            : "Try changing your search terms or clearing the filter."}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Course</th>
                <th>Email</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => {
                const isOwner = user?._id === s.userId;
                const isAdmin = user?.role === 'admin';
                const canEdit = isOwner || isAdmin;
                const canDelete = isAdmin;

                return (
                  <tr key={s.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td><strong>{s.name}</strong></td>
                    <td><code className="roll-tag">{s.roll}</code></td>
                    <td><span className="course-badge">{s.course}</span></td>
                    <td className="text-muted">{s.email}</td>
                    <td className="col-actions">
                      <div className="actions">
                        {canEdit && (
                          <button className="btn-secondary btn-sm" onClick={() => onEdit(s.id)}>
                            ✏️ Edit
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewStudents;