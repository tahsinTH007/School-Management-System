import { type Request, type Response } from "express";
import { logActivity } from "../utils/activitieslog.ts";
import AcademicYear from "../model/academicYear";

export const createAcademicYear = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, fromYear, toYear, isCurrent } = req.body;

    const existingYear = await AcademicYear.findOne({ fromYear, toYear });
    if (existingYear) {
      res.status(400).json({ message: "Academic Year already exists" });
      return;
    }

    if (isCurrent) {
      await AcademicYear.updateMany(
        { _id: { $ne: null } },
        { isCurrent: false },
      );
    }
    const academicYear = await AcademicYear.create({
      name,
      fromYear,
      toYear,
      isCurrent: isCurrent || false,
    });
    await logActivity({
      userId: (req as any).user._id,
      action: `Created academic year ${name}`,
    });
    res.status(201).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllAcademicYears = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const [total, years] = await Promise.all([
      AcademicYear.countDocuments(query),
      AcademicYear.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({
      years,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
