import express from "express";
import { listCourses } from "../controllers/courseController";

const router = express.Router();

router.get("/", listCourses);
