import express from 'express';
import Student from '../models/Student.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all students (accessible to all logged-in users, but maybe we want to filter if they are not admin? No, the requirements say admin can edit/delete, but student only edits their own. Maybe view all is ok for everyone? Wait, the user said: "student only data enter kar sakega aur bass apana hi data edit kar sakega". Nothing about viewing. Let's make view all available to logged-in users, but maybe better to only show their own if student, all if admin. Actually, 'student only data enter kar sakega' implies they should only see their own, or maybe all. Let's only return all if admin, or return all but frontend hides edit/delete. Let's return all).
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    // Transform _id to id for frontend compatibility
    const formattedStudents = students.map(student => ({
      id: student._id.toString(),
      name: student.name,
      roll: student.roll,
      course: student.course,
      email: student.email,
      userId: student.userId ? student.userId.toString() : null
    }));
    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// POST a new student
router.post('/', protect, async (req, res) => {
  try {
    const { name, roll, course, email } = req.body;
    
    // Check if user already added a student? The user said "apana hi data edit kar sakega". If a student is representing themselves, they might only add 1 student. But let's allow adding multiple just in case it's a data entry task, but linked to them.

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ roll });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const newStudent = new Student({ 
      name, 
      roll, 
      course, 
      email, 
      userId: req.user.id // Associate with the logged-in user
    });
    
    const savedStudent = await newStudent.save();
    
    res.status(201).json({
      id: savedStudent._id.toString(),
      name: savedStudent.name,
      roll: savedStudent.roll,
      course: savedStudent.course,
      email: savedStudent.email,
      userId: savedStudent.userId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving student', error: error.message });
  }
});

// PUT update a student
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, roll, course, email } = req.body;
    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check ownership or admin status
    if (student.userId && student.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to edit this student' });
    }

    // Check if updating to a roll number that already exists (and isn't this student)
    const existingStudent = await Student.findOne({ roll, _id: { $ne: req.params.id } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists for another student' });
    }

    student.name = name || student.name;
    student.roll = roll || student.roll;
    student.course = course || student.course;
    student.email = email || student.email;

    const updatedStudent = await student.save();

    res.json({
      id: updatedStudent._id.toString(),
      name: updatedStudent.name,
      roll: updatedStudent.roll,
      course: updatedStudent.course,
      email: updatedStudent.email,
      userId: updatedStudent.userId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// DELETE a student (ADMIN ONLY)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

export default router;
