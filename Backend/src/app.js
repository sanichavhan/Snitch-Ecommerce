import express from 'express'
import authRouter from "./routes/auth.routes.js";
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from "./config/config.js";
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userModel from './models/user.model.js'

const app = express()

app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));

app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: [ "GET", "POST", "PUT", "DELETE" ],
//     credentials: true
// }))

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app