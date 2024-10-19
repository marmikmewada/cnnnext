import cron from 'node-cron';
import { spawn } from 'child_process';
import path from 'path';

let taskScheduled = false;

async function runCnnScript() {
    const scriptPath = path.join(process.cwd(), 'cnn.js');
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });

    child.on('close', (code) => {
        console.log(`Puppeteer script exited with code ${code}`);
    });

    child.on('error', (err) => {
        console.error('Failed to start subprocess:', err);
    });
}

export async function GET(req) {
    if (!taskScheduled) {
        // First run the script immediately
        await runCnnScript();

        // Schedule the job to run every 24 hours
        cron.schedule('0 0 * * *', () => {
            runCnnScript();
        });

        taskScheduled = true;
        console.log('Cron job scheduled to run every 24 hours after the first execution.');
    }

    return new Response('Cron job has been scheduled and executed for the first time.', { status: 200 });
}
