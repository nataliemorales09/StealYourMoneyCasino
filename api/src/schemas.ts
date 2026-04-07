import { z } from "zod";

export const createInstructorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  department: z.string().max(200).optional().nullable(),
});

export type CreateInstructorInput = z.infer<typeof createInstructorSchema>;

export const createStudentSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const createCourseSchema = z.object({
  code: z.string().min(1).max(32),
  title: z.string().min(1).max(300),
  description: z.string().max(4000).optional().nullable(),
  instructor_id: z.coerce.number().int().positive(),
  credits: z.coerce.number().int().min(1).max(30),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const createCourseSectionSchema = z.object({
  course_id: z.coerce.number().int().positive(),
  term: z.string().min(1).max(64),
  section_code: z.string().min(1).max(32),
  schedule: z.string().max(200).optional().nullable(),
  capacity: z.coerce.number().int().min(1).max(500),
});

export type CreateCourseSectionInput = z.infer<typeof createCourseSectionSchema>;

export const createEnrollmentSchema = z.object({
  student_id: z.coerce.number().int().positive(),
  section_id: z.coerce.number().int().positive(),
  grade: z.string().max(8).optional().nullable(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

export const patchEnrollmentGradeSchema = z.object({
  grade: z.string().max(8).nullable(),
});

export type PatchEnrollmentGradeInput = z.infer<typeof patchEnrollmentGradeSchema>;
