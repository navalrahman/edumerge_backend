const Program = require('../../models/Program');

// Create a program setup
const createProgram = async (req, res) => {
    try {
        const data = req.body;
        // Validate quota equals intake
        const kcet = parseInt(data.quotas?.KCET) || 0;
        const comedk = parseInt(data.quotas?.COMEDK) || 0;
        const management = parseInt(data.quotas?.Management) || 0;

        const totalQuota = kcet + comedk + management;
        if (totalQuota !== parseInt(data.totalIntake || 0)) {
            return res.status(400).json({ error: 'Total base quota must equal total intake' });
        }

        const program = new Program(data);
        await program.save();
        res.status(201).json(program);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all programs
const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find({});
        res.json(programs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update program intake/quotas (Seat Matrix)
const updateProgram = async (req, res) => {
    try {
        const { totalIntake, quotas } = req.body;
        const program = await Program.findById(req.params.id);
        if (!program) return res.status(404).json({ error: 'Program not found' });

        // Validate quota equals intake
        const kcet = parseInt(quotas?.KCET) || 0;
        const comedk = parseInt(quotas?.COMEDK) || 0;
        const management = parseInt(quotas?.Management) || 0;

        const totalQuota = kcet + comedk + management;
        if (totalQuota !== parseInt(totalIntake || 0)) {
            return res.status(400).json({ error: 'Total base quota must equal total intake' });
        }

        program.totalIntake = totalIntake;
        program.quotas = quotas;

        await program.save();
        res.json(program);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProgram,
    getPrograms,
    updateProgram
};
