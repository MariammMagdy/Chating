const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const compression = require("compression");
dotenv.config({ path: 'config.env' });
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require('./config/database');
const mountRoutes = require("./routes/index");

// Routes
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");
const conversationRoute = require("./routes/conversationRoute");

// connect with db
dbConnection();

// express app
const app = express();

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json());
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

const Verification = require("./models/codeModel");
const deleteExpiredVerifications = async () => {
    const now = new Date();

    try {
        // Find all expired records
        const expiredVerifications = await Verification.find({
            expiresAt: { $lt: now },
        });

        // Delete all expired records
        await Verification.deleteMany({
            _id: { $in: expiredVerifications.map((v) => v._id) },
        });

        console.log(`${expiredVerifications.length} expired verifications deleted.`);
    } catch (err) {
    console.error("Error deleting expired verifications:", err);
    }
};

// Call the function
deleteExpiredVerifications();

//Mount Routes
mountRoutes(app);
app.use("/api/v1/chat/users", userRoute);
app.use("/api/v1/chat/auth", authRoute);
app.use("/api/v1/chat/message", messageRoute);
app.use("/api/v1/chat/conversation", conversationRoute);

app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});
