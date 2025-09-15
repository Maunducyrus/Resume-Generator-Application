import { Model } from "sequelize-typescript";
import User from "./User";
export default class CV extends Model {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  data: {
    personalInfo: any;
    education: any[];
    workExperience: any[];
    skills: any[];
    projects: any[];
    certifications: any[];
  };
  atsScore: number;
  isPublic: boolean;
  shareUrl?: string;
  downloadCount: number;
  tags: string[];
  profession?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
//# sourceMappingURL=CV.d.ts.map
