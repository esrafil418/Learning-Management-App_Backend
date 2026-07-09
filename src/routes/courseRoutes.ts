import express from "express";
import {
	getCourse,
	getTransactions,
	getUserCourseProgress,
	getUserEnrolledCourses,
	listCourses,
	updateUserCourseProgress,
} from "../controllers/courseController";

const router = express.Router();

router.get("/", listCourses);
router.get("/transactions", getTransactions);
router.get(
	"/users/course-progress/:userId/enrolled-courses",
	getUserEnrolledCourses,
);
router.get(
	"/users/course-progress/:userId/courses/:courseId",
	getUserCourseProgress,
);
router.put(
	"/users/course-progress/:userId/courses/:courseId",
	updateUserCourseProgress,
);
router.get("/:courseId", getCourse);

export default router;
