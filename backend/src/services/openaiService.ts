import OpenAI from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  static async generateProfessionalSummary(personalInfo: any, workExperience: any[], profession: string): Promise<string> {
    try {
      const experienceText = workExperience.map(exp => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`
      ).join(', ');

      const prompt = `Create a compelling professional summary for a ${profession} professional:

Name: ${personalInfo.fullName}
Experience: ${experienceText}
Location: ${personalInfo.location}

Requirements:
- 2-3 sentences maximum
- Highlight key achievements and skills
- Use industry-specific terminology for ${profession}
- Make it ATS-friendly
- Focus on value proposition
- Use strong action words

Generate a professional summary that would impress hiring managers in the ${profession} field.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || 'Experienced professional with a proven track record of success.';
    } catch (error) {
      logger.error('OpenAI Summary Generation Error:', error);
      return `Experienced ${profession} professional with strong background in delivering results and driving innovation.`;
    }
  }

  static async optimizeWorkExperience(experience: any, profession: string): Promise<any> {
    try {
      const prompt = `Optimize this work experience for a ${profession} professional's CV:

Position: ${experience.position}
Company: ${experience.company}
Current Responsibilities: ${experience.responsibilities.join(', ')}

Requirements:
- Use strong action verbs (Led, Developed, Implemented, Achieved, etc.)
- Quantify achievements with numbers/percentages where possible
- Make it ATS-friendly with relevant keywords for ${profession}
- Focus on impact and results
- Use bullet points format
- Include 3-5 optimized responsibilities and 2-3 key achievements

Return as JSON with 'responsibilities' and 'achievements' arrays.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          return {
            ...experience,
            responsibilities: parsed.responsibilities || experience.responsibilities,
            achievements: parsed.achievements || ['Exceeded performance targets by 20%', 'Improved team efficiency by 15%']
          };
        } catch {
          return {
            ...experience,
            responsibilities: experience.responsibilities.map((resp: string) => 
              resp.startsWith('•') ? resp : `• ${resp.charAt(0).toUpperCase() + resp.slice(1)}`
            ),
            achievements: ['Exceeded performance targets by 20%', 'Improved operational efficiency by 15%']
          };
        }
      }
      return experience;
    } catch (error) {
      logger.error('OpenAI Experience Optimization Error:', error);
      return experience;
    }
  }

  static async generateCoverLetter(cvData: any, jobDescription: string, profession: string): Promise<string> {
    try {
      const prompt = `Generate a professional cover letter for a ${profession} position:

Applicant Details:
- Name: ${cvData.personalInfo.fullName}
- Email: ${cvData.personalInfo.email}
- Current Role: ${cvData.workExperience[0]?.position || 'Professional'}
- Experience: ${cvData.workExperience.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ')}
- Key Skills: ${cvData.skills.map((skill: any) => skill.name).slice(0, 8).join(', ')}
- Education: ${cvData.education[0]?.degree} in ${cvData.education[0]?.field} from ${cvData.education[0]?.institution}

Job Description: ${jobDescription}

Requirements for ${profession} cover letter:
- Professional yet engaging tone appropriate for ${profession} industry
- Address specific job requirements mentioned in the description
- Highlight relevant experience and achievements
- Show knowledge of the company/industry
- Include specific examples of success
- Demonstrate cultural fit
- Strong opening and closing
- 3-4 paragraphs, professional business format
- Use industry-specific terminology for ${profession}

Create a compelling cover letter that would make this candidate stand out for a ${profession} position.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.8
      });

      return response.choices[0]?.message?.content || this.getFallbackCoverLetter(cvData, profession);
    } catch (error) {
      logger.error('OpenAI Cover Letter Generation Error:', error);
      return this.getFallbackCoverLetter(cvData, profession);
    }
  }

  static async generateInterviewQuestions(profession: string, jobDescription?: string, experienceLevel?: string): Promise<string[]> {
    try {
      const prompt = `Generate 12 comprehensive interview questions for a ${profession} position:

${jobDescription ? `Job Description: ${jobDescription}` : ''}
${experienceLevel ? `Experience Level: ${experienceLevel}` : ''}

Requirements:
- Include behavioral questions (STAR method)
- Technical questions specific to ${profession}
- Situational/scenario-based questions
- Leadership and teamwork questions
- Industry-specific challenges
- Questions about career goals and motivation
- Problem-solving scenarios relevant to ${profession}
- Questions about handling difficult situations

Mix of difficulty levels appropriate for ${profession} interviews.
Return as a JSON array of question strings.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const questions = JSON.parse(content);
          return Array.isArray(questions) ? questions : this.getFallbackQuestions(profession);
        } catch {
          return content.split('\n')
            .filter(q => q.trim().length > 0 && q.includes('?'))
            .slice(0, 12);
        }
      }
      return this.getFallbackQuestions(profession);
    } catch (error) {
      logger.error('OpenAI Interview Questions Error:', error);
      return this.getFallbackQuestions(profession);
    }
  }

  static async calculateATSScore(cvData: any, profession: string): Promise<{ score: number; suggestions: string[] }> {
    try {
      const prompt = `Analyze this ${profession} CV for ATS (Applicant Tracking System) compatibility:

Personal Info: ${JSON.stringify(cvData.personalInfo)}
Work Experience: ${JSON.stringify(cvData.workExperience)}
Education: ${JSON.stringify(cvData.education)}
Skills: ${JSON.stringify(cvData.skills)}

Evaluate based on:
1. Contact information completeness
2. Professional summary quality
3. Work experience descriptions (action verbs, quantified achievements)
4. Skills relevance to ${profession}
5. Education formatting
6. Keyword optimization for ${profession}
7. Overall structure and formatting
8. ATS-friendly formatting (no graphics, proper headings)

Return JSON with:
{
  "score": number (0-100),
  "suggestions": ["specific improvement suggestion 1", "suggestion 2", ...]
}

Provide actionable suggestions for improving ATS compatibility specifically for ${profession} roles.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const result = JSON.parse(content);
          return {
            score: Math.min(100, Math.max(0, result.score || 75)),
            suggestions: result.suggestions || []
          };
        } catch {
          return this.getFallbackATSScore(cvData);
        }
      }
      return this.getFallbackATSScore(cvData);
    } catch (error) {
      logger.error('OpenAI ATS Score Error:', error);
      return this.getFallbackATSScore(cvData);
    }
  }

  static async optimizeForJob(cvData: any, jobDescription: string, profession: string): Promise<any> {
    try {
      const prompt = `Optimize this ${profession} CV for the following job posting:

Job Description: ${jobDescription}

Current CV Data: ${JSON.stringify(cvData)}

Provide optimization suggestions:
1. Keywords to add/emphasize
2. Skills to highlight
3. Experience descriptions to modify
4. Summary improvements
5. Missing qualifications to address
6. Industry-specific improvements for ${profession}

Return JSON with:
{
  "keywords": ["keyword1", "keyword2", ...],
  "skillSuggestions": ["skill1", "skill2", ...],
  "experienceImprovements": ["improvement1", "improvement2", ...],
  "summaryImprovement": "improved summary text",
  "missingQualifications": ["qualification1", "qualification2", ...],
  "overallScore": number (0-100)
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          return {
            keywords: ['leadership', 'innovation', 'results-driven'],
            skillSuggestions: ['Communication', 'Project Management'],
            experienceImprovements: ['Add more quantified achievements', 'Include relevant technical skills'],
            overallScore: 75
          };
        }
      }
      return null;
    } catch (error) {
      logger.error('OpenAI Job Optimization Error:', error);
      return null;
    }
  }

  static async generateSkillSuggestions(profession: string, experience: any[]): Promise<string[]> {
    try {
      const experienceText = experience.map(exp => `${exp.position} at ${exp.company}`).join(', ');
      
      const prompt = `Based on this ${profession} professional's background:
${experienceText}

Suggest 15 relevant skills that would strengthen their CV for ${profession} roles:
- Include both technical and soft skills
- Focus on current industry trends for ${profession}
- Consider skills that are in high demand
- Include emerging technologies/methodologies relevant to ${profession}

Return as JSON array of skill names.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const skills = JSON.parse(content);
          return Array.isArray(skills) ? skills : [];
        } catch {
          return content.split('\n').filter(s => s.trim().length > 0).slice(0, 15);
        }
      }
      return [];
    } catch (error) {
      logger.error('OpenAI Skill Suggestions Error:', error);
      return ['Communication', 'Leadership', 'Problem Solving', 'Project Management', 'Teamwork'];
    }
  }

  private static getFallbackCoverLetter(cvData: any, profession: string): string {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${profession} position at your company. With my background in ${cvData.workExperience[0]?.position || 'professional services'} and ${cvData.education[0]?.degree || 'relevant education'}, I am confident I would be a valuable addition to your team.

My experience at ${cvData.workExperience[0]?.company || 'previous companies'} has equipped me with the skills necessary to excel in this role. I have successfully ${cvData.workExperience[0]?.responsibilities[0] || 'contributed to various projects'}, demonstrating my ability to deliver results in challenging environments.

I am particularly drawn to this opportunity because it aligns perfectly with my career goals and allows me to leverage my expertise in ${cvData.skills.slice(0, 3).map((s: any) => s.name).join(', ')}.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team's continued success.

Sincerely,
${cvData.personalInfo.fullName}`;
  }

  private static getFallbackQuestions(profession: string): string[] {
    const baseQuestions = [
      "Tell me about yourself and your background.",
      "Why are you interested in this position?",
      "What are your greatest strengths?",
      "Describe a challenging situation you faced and how you handled it.",
      "Where do you see yourself in 5 years?",
      "What motivates you in your work?",
      "How do you handle working under pressure?",
      "Describe your experience with team collaboration."
    ];

    const professionSpecific: { [key: string]: string[] } = {
      'software engineer': [
        "Describe your experience with version control systems.",
        "How do you approach debugging complex issues?",
        "What's your experience with agile development methodologies?",
        "How do you stay updated with new technologies?"
      ],
      'marketing': [
        "How do you measure the success of a marketing campaign?",
        "Describe your experience with digital marketing tools.",
        "How do you stay updated with marketing trends?",
        "Tell me about a successful campaign you've managed."
      ],
      'manager': [
        "How do you motivate your team during challenging times?",
        "Describe your leadership style.",
        "How do you handle conflicts within your team?",
        "Tell me about a time you had to make a difficult decision."
      ]
    };

    const category = Object.keys(professionSpecific).find(key => 
      profession.toLowerCase().includes(key)
    );
    
    return [...baseQuestions, ...(category ? professionSpecific[category] : [])];
  }

  private static getFallbackATSScore(cvData: any): { score: number; suggestions: string[] } {
    let score = 0;
    const suggestions: string[] = [];

    // Personal info completeness (25 points)
    const personalFields = Object.values(cvData.personalInfo).filter((v: any) => v && v.length > 0);
    const personalScore = Math.min(25, (personalFields.length / 7) * 25);
    score += personalScore;
    
    if (personalScore < 20) {
      suggestions.push('Complete all personal information fields');
    }

    // Work experience (30 points)
    const expScore = Math.min(30, cvData.workExperience.length * 10);
    score += expScore;
    
    if (expScore < 20) {
      suggestions.push('Add more detailed work experience');
    }

    // Education (20 points)
    const eduScore = Math.min(20, cvData.education.length * 10);
    score += eduScore;

    // Skills (15 points)
    const skillScore = Math.min(15, cvData.skills.length * 1.5);
    score += skillScore;
    
    if (skillScore < 10) {
      suggestions.push('Add more relevant skills');
    }

    // Projects & Certifications (10 points)
    const extraScore = Math.min(10, (cvData.projects.length + cvData.certifications.length) * 2);
    score += extraScore;

    if (suggestions.length === 0) {
      suggestions.push('Your CV looks good! Consider adding quantified achievements.');
    }

    return { score: Math.round(score), suggestions };
  }
}