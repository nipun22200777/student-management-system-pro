import { useState, useEffect, useMemo } from "react";
import type { Student } from "../App";

interface Props {
  students: Student[];
}

function Home({ students }: Props) {
  const [dbStatus, setDbStatus] = useState<string>("Checking...");

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setDbStatus(data.status))
      .catch(() => setDbStatus("Backend not running or Error"));
  }, []);

  const totalStudents = students.length;
  const uniqueCourses = useMemo(() => {
    return new Set(students.map((s) => s.course)).size;
  }, [students]);

  return (
    <div className="home-dashboard">
      <div className="card dashboard-header">
        <h1>Student Management Dashboard</h1>
        <p>A modern and intuitive system to manage your institution's records effortlessly.</p>
        <div className="db-status-badge">
          <strong>MongoDB Status: </strong>
          <span className={dbStatus === 'Connected' ? 'status-connected' : 'status-disconnected'}>
            {dbStatus}
          </span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="card stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-number">{totalStudents}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Active Courses</h3>
            <p className="stat-number">{uniqueCourses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;