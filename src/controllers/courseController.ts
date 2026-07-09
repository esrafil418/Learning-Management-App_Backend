import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

type CourseParams = {
	courseId: string;
};

export const listCourses = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { category } = req.query;
	try {
		const courses =
			category && category !== "all"
				? await Course.scan("category").eq(category).exec()
				: await Course.scan().exec();
		res.json({ message: "Courses retrieved successfully", data: courses });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving courses", error });
	}
};

export const getCourse = async (
	req: Request<CourseParams>,
	res: Response,
): Promise<void> => {
	const { courseId } = req.params;
	try {
		const course = await Course.get(courseId);
		if (!course) {
			res.status(404).json({ message: "Course not found" });
			return;
		}

		res.json({ message: "Course retrieved successfully", data: course });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving course", error });
	}
};

export const getTransactions = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { userId } = req.query;
	try {
		const transactions = userId
			? await Transaction.scan("userId").eq(String(userId)).exec()
			: await Transaction.scan().exec();
		res.json({
			message: "Transactions retrieved successfully",
			data: transactions,
		});
	} catch (error) {
		res.status(500).json({ message: "Error retrieving transactions", error });
	}
};

export const getUserEnrolledCourses = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { userId } = req.params;
	try {
		const progressItems = await UserCourseProgress.scan("userId")
			.eq(userId)
			.exec();
		const courseIds = progressItems.map((item) => item.courseId);
		const courses = courseIds.length ? await Course.batchGet(courseIds) : [];
		res.json({
			message: "Enrolled courses retrieved successfully",
			data: courses,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error retrieving enrolled courses", error });
	}
};

export const getUserCourseProgress = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { userId, courseId } = req.params;
	const resolvedUserId = Array.isArray(userId) ? userId[0] : userId;
	const resolvedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
	try {
		const progress = await UserCourseProgress.get({
			userId: resolvedUserId,
			courseId: resolvedCourseId,
		});
		if (!progress) {
			res.status(404).json({ message: "Course progress not found" });
			return;
		}
		res.json({
			message: "Course progress retrieved successfully",
			data: progress,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error retrieving course progress", error });
	}
};

export const updateUserCourseProgress = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { userId, courseId } = req.params;
	const resolvedUserId = Array.isArray(userId) ? userId[0] : userId;
	const resolvedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
	try {
		const existing = await UserCourseProgress.get({
			userId: resolvedUserId,
			courseId: resolvedCourseId,
		});
		const updated = existing
			? await UserCourseProgress.update(
					{ userId: resolvedUserId, courseId: resolvedCourseId },
					req.body,
				)
			: await UserCourseProgress.create({
					userId: resolvedUserId,
					courseId: resolvedCourseId,
					...req.body,
				});
		res.json({
			message: "Course progress updated successfully",
			data: updated,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating course progress", error });
	}
};
