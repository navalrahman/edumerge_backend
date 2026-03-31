const Applicant = require('../../models/Applicant');
const Program = require('../../models/Program');

// Create an applicant
const createApplicant = async (req, res) => {
    try {
        const data = req.body;
        // Map frontend fields (from BRS) to model fields
        const applicantData = {
            ...data,
            name: data.fullName || data.name,
            marks: data.qualifyingMarks || data.marks
        };
        const applicant = new Applicant(applicantData);
        await applicant.save();
        res.status(201).json(applicant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get applicants
const getApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find().populate('programId');
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update applicant documents/fee
const updateApplicant = async (req, res) => {
    try {
        const { documentStatus, feeStatus } = req.body;
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

        if (documentStatus) applicant.documentStatus = documentStatus;
        if (feeStatus) applicant.feeStatus = feeStatus;

        await applicant.save();
        res.json(applicant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Allocate Seat (Locking)
// const allocateSeat = async (req, res) => {
//     console.log('req', req.body.applicant);

//     try {
//         const { documentStatus, feeStatus } = req.body.applicant;
//         console.log('documentStatus', documentStatus);
//         console.log('feeStatus', feeStatus);
//         const applicant = await Applicant.findById(req.params.id);
//         if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

//         if (documentStatus) applicant.documentStatus = documentStatus;
//         if (feeStatus) applicant.feeStatus = feeStatus;

//         await applicant.save();
//         res.json(applicant);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
//     // try {
//     //     console.log('🚀 Allocating Seat for:', req.params.applicantId);
//     //     const applicant = await Applicant.findById(req.params.applicantId);
//     //     if (!applicant) return res.status(404).json({ error: 'Applicant not found' });
//     //     if (applicant.status !== 'Draft') return res.status(400).json({ error: 'Applicant seat already locked or admitted' });

//     //     const programId = req.body.programId || applicant.programId;
//     //     const quotaType = req.body.quotaType || applicant.quotaType;
//     //     console.log('📦 Program:', programId, 'Quota:', quotaType);

//     //     if (!programId || !quotaType) return res.status(400).json({ error: 'Program ID and Quota Type required' });

//     //     const program = await Program.findById(programId);
//     //     if (!program) return res.status(404).json({ error: 'Program not found' });

//     //     if (!program.filledSeats) program.filledSeats = { KCET: 0, COMEDK: 0, Management: 0 };
//     //     if (!program.quotas) program.quotas = { KCET: 0, COMEDK: 0, Management: 0 };

//     //     const allowedQuota = program.quotas[quotaType] || 0;
//     //     const filledQuota = program.filledSeats[quotaType] || 0;

//     //     if (filledQuota >= allowedQuota) {
//     //         return res.status(400).json({ error: `Quota full for ${quotaType}` });
//     //     }

//     //     program.filledSeats[quotaType] = filledQuota + 1;
//     //     program.markModified('filledSeats'); // Ensure Mongoose tracks the update
//     //     await program.save();

//     //     applicant.programId = programId;
//     //     applicant.quotaType = quotaType;
//     //     applicant.status = 'Seat Locked';

//     //     if (req.body.allotmentNumber) applicant.allotmentNumber = req.body.allotmentNumber;

//     //     await applicant.save();
//     //     res.json({ message: 'Seat allocated successfully', applicant });

//     // } catch (err) {
//     //     res.status(500).json({ error: err.message });
//     // }
// };

const allocateSeat = async (req, res) => {
    try {
        console.log('🚀 Allocating Seat for:', req.params.id);

        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        // ✅ Prevent re-allocation
        if (applicant.status !== 'Draft') {
            return res.status(400).json({
                error: 'Seat already locked or applicant already admitted'
            });
        }

        // ✅ Get program + quota from applicant (no need from body)
        const programId = applicant.programId;
        const quotaType = applicant.quotaType;

        if (!programId || !quotaType) {
            return res.status(400).json({
                error: 'Program ID or quota type missing in applicant'
            });
        }

        // ✅ Fetch program
        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }

        // ✅ Safe defaults
        const allowedQuota = program.quotas?.[quotaType] || 0;
        const filledQuota = program.filledSeats?.[quotaType] || 0;

        console.log('📊 Quota:', quotaType);
        console.log('Allowed:', allowedQuota, 'Filled:', filledQuota);

        // ❌ No seats left
        if (filledQuota >= allowedQuota) {
            return res.status(400).json({
                error: `No seats left in ${quotaType}`
            });
        }

        // ✅ ATOMIC UPDATE (prevents race condition)
        const updatedProgram = await Program.findOneAndUpdate(
            {
                _id: programId,
                [`filledSeats.${quotaType}`]: { $lt: allowedQuota }
            },
            {
                $inc: { [`filledSeats.${quotaType}`]: 1 }
            },
            { new: true }
        );

        if (!updatedProgram) {
            return res.status(400).json({
                error: 'Seat just got filled. Try again.'
            });
        }

        // ✅ Update applicant
        applicant.status = 'Seat Locked';

        // optional
        if (req.body?.allotmentNumber) {
            applicant.allotmentNumber = req.body.allotmentNumber;
        }

        await applicant.save();

        res.json({
            message: '✅ Seat allocated successfully',
            applicant
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Confirm Admission
const confirmAdmission = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.applicantId).populate('programId');
        if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

        if (applicant.status !== 'Seat Locked') {
            return res.status(400).json({ error: 'Seat must be locked before confirmation' });
        }

        if (applicant.feeStatus !== 'Paid') {
            return res.status(400).json({ error: 'Fee must be paid to confirm admission' });
        }

        if (applicant.documentStatus !== 'Verified') {
            return res.status(400).json({ error: 'Documents must be verified to confirm admission' });
        }

        const prog = applicant.programId;
        const count = await Applicant.countDocuments({
            programId: prog._id,
            quotaType: applicant.quotaType,
            status: 'Admitted'
        });

        const seq = String(count + 1).padStart(4, '0');
        const inst = prog.institution ? prog.institution.replace(/\s+/g, '').toUpperCase() : 'INST';
        const cType = prog.courseType ? prog.courseType.replace(/\s+/g, '').toUpperCase() : 'UG';
        const pName = prog.programName ? prog.programName.replace(/\s+/g, '').toUpperCase() : 'PROG';
        const qType = applicant.quotaType.toUpperCase();

        const admNo = `${inst}/2026/${cType}/${pName}/${qType}/${seq}`;

        applicant.admissionNumber = admNo;
        applicant.status = 'Admitted';
        await applicant.save();

        res.json({ message: 'Admission confirmed', admissionNumber: admNo, applicant });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createApplicant,
    getApplicants,
    updateApplicant,
    allocateSeat,
    confirmAdmission
};
