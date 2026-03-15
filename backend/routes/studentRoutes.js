import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    // Transform _id to id for frontend compatibility
    const formattedStudents = students.map(student => ({
      id: student._id.toString(),
      name: student.name,
      roll: student.roll,
      course: student.course,
      email: student.email
    }));
    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// POST a new student
router.post('/', async (req, res) => {
  try {
    const { name, roll, course, email } = req.body;
    
    // Check if roll number already exists
    const existingStudent = await Student.findOne({ roll });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const newStudent = new Student({ name, roll, course, email });
    const savedStudent = await newStudent.save();
    
    res.status(201).json({
      id: savedStudent._id.toString(),
      name: savedStudent.name,
      roll: savedStudent.roll,
      course: savedStudent.course,
      email: savedStudent.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving student', error: error.message });
  }
});

// PUT update a student
router.put('/:id', async (req, res) => {
  try {
    const { name, roll, course, email } = req.body;
    
    // Check if updating to a roll number that already exists (and isn't this student)
    const existingStudent = await Student.findOne({ roll, _id: { $ne: req.params.id } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists for another student' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, roll, course, email },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      id: updatedStudent._id.toString(),
      name: updatedStudent.name,
      roll: updatedStudent.roll,
      course: updatedStudent.course,
      email: updatedStudent.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
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
