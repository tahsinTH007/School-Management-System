import activitieslog from "../model/activitieslog";

export const logActivity = async ({
  userId,
  action,
  details,
}: {
  userId: string;
  action: string;
  details?: string;
}) => {
  try {
    await activitieslog.create({
      user: userId,
      action,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
