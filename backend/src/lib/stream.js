import { StreamChat } from "stream-chat";
import "dotenv/config";

const apikey = process.env.STREAM_API_KEY;
const apisecret = process.env.STREAM_API_SECRET;

if(!apikey || !apisecret){
    console.error("Stream apikey or secret is missing");
}

const streamClient = StreamChat.getInstance(apikey, apisecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]);
        return userData;
    }
    catch (error){
        console.error("Error upserting stream user:", error);
    }
};

export const generateStreamToken = async(userId) => {
    try{
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    }
    catch(error){
        console.error("Error generating stream token:", error);
    }
}