const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  dob: Date,
  gender: String,
  address: String,
  category: String,
  admissionMode: String,
  entryType: String,
  quotaType: String, // 'KCET', 'COMEDK', 'Management'
  marks: Number,
  allotmentNumber: String,
  documentStatus: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Pending' },
  feeStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  status: { type: String, enum: ['Draft', 'Seat Locked', 'Admitted'], default: 'Draft' },
  admissionNumber: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', ApplicantSchema);
