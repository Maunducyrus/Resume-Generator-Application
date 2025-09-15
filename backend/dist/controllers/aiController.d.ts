import { Request, Response } from "express";
export declare const generateSummary: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const optimizeExperience: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateCoverLetter: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateInterviewQuestions: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const calculateATSScore: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const optimizeForJob: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateSkillSuggestions: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=aiController.d.ts.map
