import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
}, { timestamps: true, collection: 'studentsdetails' });

const Student = mongoose.model('Student', studentSchema);

export default Student;
