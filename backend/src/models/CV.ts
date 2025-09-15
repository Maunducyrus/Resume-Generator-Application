import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table({
  tableName: "cvs",
  timestamps: true,
})
export default class CV extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  templateId!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  data!: {
    personalInfo: any;
    education: any[];
    workExperience: any[];
    skills: any[];
    projects: any[];
    certifications: any[];
  };

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  })
  atsScore!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPublic!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  shareUrl?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  downloadCount!: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  tags!: string[];

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  profession?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}
