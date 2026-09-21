const { exec } = require('child_process');
const asyncHandler = require('../utils/asyncHandler');

/**
 * 🚀 GET /api/deploy/:project or POST /api/admin/deploy
 * Runs: bash /home/ubuntu/scripts/<project>.sh
 * Returns stdout/logs and success/error status to frontend.
 */
const triggerDeploy = asyncHandler(async (req, res) => {
    // Extract project from URL param or body (default to 'accusoft')
    const rawTarget = req.params?.project || req.body?.target || 'accusoft';
    const project = String(rawTarget).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '') || 'accusoft';

    // Target script path on VPS
    const scriptPath = `/home/ubuntu/scripts/${project}.sh`;
    const isWindows = process.platform === 'win32';

    // Local dry-run test mode for Windows dev environment
    if (isWindows) {
        const simulatedLogs = [
            `🚀 [${new Date().toLocaleTimeString()}] Local Test Mode (Windows)`,
            `📁 Executing: bash ${scriptPath}`,
            `📦 Project: ${project.toUpperCase()}`,
            `🌐 Pulling git, syncing build & restarting PM2... (Simulated)`,
            `✅ Deployed ${project} successfully!`
        ].join('\n');

        return res.status(200).json({
            success: true,
            message: `Deployed ${project} successfully!`,
            logs: simulatedLogs,
            output: simulatedLogs
        });
    }

    // Execute bash /home/ubuntu/scripts/<project>.sh on Linux VPS
    exec(`bash "${scriptPath}"`, { timeout: 120000, maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Deployment error for ${project}:`, error.message);
            return res.status(500).json({
                success: false,
                message: `Deployment failed for ${project}`,
                error: error.message,
                logs: stderr || stdout || error.message
            });
        }

        if (stderr) {
            console.warn(`⚠️ Deployment stderr for ${project}:`, stderr);
        }

        console.log(`✅ Deployed ${project} successfully:\n`, stdout);
        return res.status(200).json({
            success: true,
            message: `Deployed ${project} successfully!`,
            logs: stdout || `Deployed ${project} successfully!`,
            output: stdout
        });
    });
});

module.exports = {
    triggerDeploy
};
