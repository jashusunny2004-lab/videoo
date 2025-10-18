import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullname } = req.body;

    try{
        if(!email || !password || !fullname){
            return res.status(400).json({ message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must contain at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "Email already exists, Please use a different email" });
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = await User.create({
            email,
            fullname,
            password,
            profilepic: avatar,
        });

        try{
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilepic || ""
            });
            console.log(`Stream user created ${newUser.fullname}`)
        }
        catch(error){
            console.log("Error creating Stream User:", error);
        }

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //Prevents XSS attack
            sameSite: "strict", //prevents CSRF attack
            secure: process.env.NODE_ENV==="production"
        });

        res.status(201).json({ success: true, user: newUser});
    }
    catch(error){
        console.log("Error in server controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req, res) {

    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required"});
        }

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({message: "Invalid Email or password"});

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({ message: "Invalid Email or password"});

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //Prevents XSS attack
            sameSite: "strict", //prevents CSRF attack
            secure: process.env.NODE_ENV==="production"
        });

        res.status(200).json({ success: true, user});

    }
    catch(error){
        console.log("Error login controller", error.message);
        res.status(500).json({ message: "Internal Server error"});
    }
}

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true ,message: "Logout Successful" });
}

export async function onboard(req, res) {
    try{
        const userid = req.user._id;

        const { fullname, bio, nativeLanguage, learningLanguage, location } = req.body;

        if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({ 
                message: "All fields are required",
                missingField: [
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userid, {
            fullname,
            bio,
            nativeLanguage: nativeLanguage,
            learningLanguage: learningLanguage,
            location,
            isOnboarded: true,
        }, { new: true });

        if(!updatedUser){
            return res.status(404).json({ message: "User not found"});
        }

        try{
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilepic || ""
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`);
        }
        catch(error){
            console.log("Error updaating Stream User during onboarding:", error.message);
        }

        res.status(201).json({ success: true, user: updatedUser});
    }
    catch(error){
        console.log("Error in onboard controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}