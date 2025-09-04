import { Request, Response } from 'express';
export declare const createCV: (req: Request, res: Response) => Promise<void>;
export declare const getUserCVs: (req: Request, res: Response) => Promise<void>;
export declare const getCVById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const shareCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSharedCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cvController.d.ts.map