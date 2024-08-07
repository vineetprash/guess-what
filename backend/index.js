"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = __importDefault(require("zod"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let count = 0;
setInterval(() => {
    count = 0;
}, 60 * 1000);
app.get("/", (req, res) => {
    res.json({ message: "Hello" });
});
app.post("/imageToText", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    count += 1;
    if (count > 20) {
        res.status(400).json({
            success: true,
            message: "Facing high traffic currently...",
        });
        return;
    }
    const body = req.body;
    const schema = zod_1.default.object({
        blob: zod_1.default.any(),
    });
    const validation = schema.safeParse(body);
    // console.log(body, validation);
    if (!validation.success) {
        res.status(400).json({ success: false, message: "Invalid body" });
        return;
    }
    const imagePart = {
        inlineData: {
            data: (_a = validation.data) === null || _a === void 0 ? void 0 : _a.blob,
            mimeType: "image/png",
        },
    };
    let result;
    const prompt = "This is an image generated in a software similar to ms-paint. Try to describe it the best you can in the least number of words required";
    try {
        result = yield model.generateContent([prompt, imagePart]);
        res.json({ success: true, message: result.response.text() });
    }
    catch (err) {
        console.error("Error :", err);
        res.status(500).json({
            success: false,
            message: "Failed to generate text",
        });
    }
    // console.log(result.response.text());
}));
app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
