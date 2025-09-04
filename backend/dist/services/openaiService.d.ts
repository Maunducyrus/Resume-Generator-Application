export declare class OpenAIService {
    static generateProfessionalSummary(personalInfo: any, workExperience: any[], profession: string): Promise<string>;
    static optimizeWorkExperience(experience: any, profession: string): Promise<any>;
    static generateCoverLetter(cvData: any, jobDescription: string, profession: string): Promise<string>;
    static generateInterviewQuestions(profession: string, jobDescription?: string, experienceLevel?: string): Promise<string[]>;
    static calculateATSScore(cvData: any, profession: string): Promise<{
        score: number;
        suggestions: string[];
    }>;
    static optimizeForJob(cvData: any, jobDescription: string, profession: string): Promise<any>;
    static generateSkillSuggestions(profession: string, experience: any[]): Promise<string[]>;
    private static getFallbackCoverLetter;
    private static getFallbackQuestions;
    private static getFallbackATSScore;
}
//# sourceMappingURL=openaiService.d.ts.map