import fs from 'fs';
import path from 'path';

export async function GET(req) {
    // Construct the path to the cnn.json file in the root directory
    const filePath = path.join(process.cwd(), 'cnn.json');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Read the data from the JSON file
    const data = fs.readFileSync(filePath, 'utf-8');
    return new Response(data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
