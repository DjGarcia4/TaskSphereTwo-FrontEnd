import { Project, TeamMember } from "../types";

export const isManager = (
  managerId: Project["manager"],
  _id: TeamMember["_id"]
) => managerId.some((manager) => manager.toString() === _id);
