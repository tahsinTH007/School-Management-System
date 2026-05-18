import { type Request, type Response } from "express";
import { logActivity } from "../utils/activitieslog.ts";
import Timetable from "../model/timetable.ts";

export const generateTimetable = async (req: Request, res: Response) => {
  try {
    const { classId, academicYearId, settings } = req.body;

    const userId = (req as any).user._id;
    await logActivity({
      userId,
      action: `Requested timetable generation for class ID: ${classId}`,
    });
    res.status(200).json({ message: "Timetable generation initiated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getTimetable = async (req: Request, res: Response) => {
  try {
    const timetable = await Timetable.findOne({ class: req.params.classId })
      .populate("schedule.periods.subject", "name code")
      .populate("schedule.periods.teacher", "name email");

    if (!timetable)
      return res.status(404).json({ message: "Timetable not found" });

    res.json(timetable);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
