import { type Request, type Response } from "express";
import { logActivity } from "../utils/activitieslog.ts";
import Exam from "../model/exam.ts";

export const triggerExamGeneration = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subject,
      class: classId,
      duration,
      dueDate,
      topic,
      difficulty,
      count,
    } = req.body;

    const teacherId = (req as any).user._id;
    const draftExam = await Exam.create({
      title: title || `Auto-Generated: ${topic}`,
      subject,
      class: classId,
      teacher: teacherId,
      duration: duration || 60,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: false,
      questions: [],
    });

    const userId = (req as any).user._id;
    await logActivity({
      userId,
      action: `User triggered exam generation: ${draftExam._id}`,
    });

    res.status(202).json({
      message: "Exam generation started.",
      examId: draftExam._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      teacher: (req as any).user._id,
    });
    const userId = (req as any).user._id;
    await logActivity({ userId, action: "User created a new exam" });
    res.status(201).json(exam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
