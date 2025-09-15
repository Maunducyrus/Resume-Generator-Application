"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
let CV = class CV extends sequelize_typescript_1.Model {};
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.UUID,
      defaultValue: sequelize_typescript_1.DataType.UUIDV4,
      primaryKey: true,
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "id",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.UUID,
      allowNull: false,
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "userId",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "name",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.STRING,
      allowNull: false,
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "templateId",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.JSONB,
      allowNull: false,
    }),
    __metadata("design:type", Object),
  ],
  CV.prototype,
  "data",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    }),
    __metadata("design:type", Number),
  ],
  CV.prototype,
  "atsScore",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.BOOLEAN,
      defaultValue: false,
    }),
    __metadata("design:type", Boolean),
  ],
  CV.prototype,
  "isPublic",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.STRING,
      allowNull: true,
      unique: true,
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "shareUrl",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.INTEGER,
      defaultValue: 0,
    }),
    __metadata("design:type", Number),
  ],
  CV.prototype,
  "downloadCount",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.ARRAY(
        sequelize_typescript_1.DataType.STRING,
      ),
      defaultValue: [],
    }),
    __metadata("design:type", Array),
  ],
  CV.prototype,
  "tags",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.Column)({
      type: sequelize_typescript_1.DataType.STRING(100),
      allowNull: true,
    }),
    __metadata("design:type", String),
  ],
  CV.prototype,
  "profession",
  void 0,
);
__decorate(
  [sequelize_typescript_1.CreatedAt, __metadata("design:type", Date)],
  CV.prototype,
  "createdAt",
  void 0,
);
__decorate(
  [sequelize_typescript_1.UpdatedAt, __metadata("design:type", Date)],
  CV.prototype,
  "updatedAt",
  void 0,
);
__decorate(
  [
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default),
  ],
  CV.prototype,
  "user",
  void 0,
);
CV = __decorate(
  [
    (0, sequelize_typescript_1.Table)({
      tableName: "cvs",
      timestamps: true,
    }),
  ],
  CV,
);
exports.default = CV;
//# sourceMappingURL=CV.js.map
