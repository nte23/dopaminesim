import type { Company, Job } from "./types";

export type DraftApplication = {
  uid: string;
  companyId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  emphasizedSkills: string[];
  answers: Record<string, string>;
  salaryAsk: number;
  coverLetter: string;
  atsScore: number;
};

export type Profile = {
  name: string;
  headline: string;
  dreamSalary: number;
};

export function makeUid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function atsScore(skills: number, coverLen: number, buzzPulls: number): number {
  const raw = 38 + skills * 7 + Math.min(20, Math.floor(coverLen / 30)) + buzzPulls * 4;
  return Math.max(0, Math.min(99, raw));
}

export function defaultSalaryAsk(job: Job): number {
  return Math.round((job.salaryMin + job.salaryMax) / 2 / 1000) * 1000;
}

/** A one-tap default application (for Easy-Apply / spray mode). */
export function easyApplyDraft(company: Company, job: Job): DraftApplication {
  const skills = job.skills.slice(0, 3);
  return {
    uid: makeUid(),
    companyId: company.id,
    jobId: job.id,
    jobTitle: job.title,
    companyName: company.name,
    emphasizedSkills: skills,
    answers: {},
    salaryAsk: defaultSalaryAsk(job),
    coverLetter: "",
    atsScore: atsScore(skills.length, 0, 0),
  };
}
