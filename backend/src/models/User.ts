import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BeforeCreate,
} from "sequelize-typescript";
import bcrypt from "bcryptjs";
import CV from "./CV";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  profession?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetPasswordToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetPasswordExpires?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => CV)
  cvs!: CV[];

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    return values;
  }
}
