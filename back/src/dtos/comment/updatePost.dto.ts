import z from "zod";

export interface UpdateCommentInputDTO {
  token: string;
  id: string;
  content: string;
}

export type UpdateCommentOutputDTO = undefined

export const UpdateCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1),
    content: z.string().min(1),
  })
  .transform((data) => data as UpdateCommentInputDTO);
