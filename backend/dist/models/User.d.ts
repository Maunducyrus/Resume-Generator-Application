import { Model } from "sequelize-typescript";
import CV from "./CV";
export default class User extends Model {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  profession?: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  cvs: CV[];
  static hashPassword(user: User): Promise<void>;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}
//# sourceMappingURL=User.d.ts.map
