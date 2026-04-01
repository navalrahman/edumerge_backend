const Program = require('../../models/Program');
const Applicant = require('../../models/Applicant');

const getDashboardStats = async (req, res) => {
    try {
        const programs = await Program.find({});
        let totalIntake = 0;
        let totalAdmitted = 0;
        let seatMatrix = [];

        programs.forEach(p => {
            const intake = p.totalIntake || 0;

            totalIntake += intake;

            const kAdmitted = p.filledSeats?.KCET || 0;
            const cAdmitted = p.filledSeats?.COMEDK || 0;
            const mAdmitted = p.filledSeats?.Management || 0;

            totalAdmitted += (kAdmitted + cAdmitted + mAdmitted);

            seatMatrix.push({
                programName: p.programName,
                totalIntake: intake, 
                quotas: p.quotas || {},
                filledSeats: p.filledSeats || {},
                remaining: {
                    KCET: (p.quotas?.KCET || 0) - kAdmitted,
                    COMEDK: (p.quotas?.COMEDK || 0) - cAdmitted,
                    Management: (p.quotas?.Management || 0) - mAdmitted
                }
            });
        });
        const pendingDocs = await Applicant.countDocuments({ documentStatus: 'Pending' });
        const pendingFees = await Applicant.countDocuments({ feeStatus: 'Pending', status: { $in: ['Seat Locked', 'Draft'] } });

        res.json({
            totalIntake,
            totalAdmitted,
            remainingSeats: totalIntake - totalAdmitted,
            pendingDocsCount: pendingDocs,
            pendingFeeCount: pendingFees,
            seatMatrix
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboardStats
};
