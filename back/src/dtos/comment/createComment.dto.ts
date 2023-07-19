import z from "zod";

export interface CreateCommentInputDTO {
  token: string;
  content: string;
  postId: string;
}
export type CreateCommentOutputDTO = undefined

export const CreateCommentScheme = z
  .object({
    token: z.string().min(1),
    content: z.string().min(1),
    postId: z.string().min(1),
  })
  .transform((data) => data as CreateCommentInputDTO);
