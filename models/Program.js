const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  institution: String,
  campus: String,
  department: String,
  programName: String,
  academicYear: String,
  courseType: String,
  entryType: String,
  admissionMode: String,
  totalIntake: Number,
  quotas: {
    KCET: { type: Number, default: 0 },
    COMEDK: { type: Number, default: 0 },
    Management: { type: Number, default: 0 }
  },
  filledSeats: {
    KCET: { type: Number, default: 0 },
    COMEDK: { type: Number, default: 0 },
    Management: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);
