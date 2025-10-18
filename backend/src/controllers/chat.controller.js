import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try{
        const token = await generateStreamToken(req.user.id);

        if (!token) {
            throw new Error('Failed to generate Stream token');
        }

        res.status(200).json({ token });
    }
    catch(error){
        console.error("Error in get Stream token controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}