import z from 'zod'

// Esquema de validación para los datos de la oferta de trabajo
const JobSchema = z.object({
  title: z.string({
    invalid_type_error: 'Job title must be a string',
    required_error: 'Job title is required.'
  }),
  description: z.string(),
  location: z.string(),
  salary: z.number().nonnegative(),
  date_posted: z.date().optional()
})

export const validateJob = (input) => {
  return JobSchema.safeParse(input)
}
