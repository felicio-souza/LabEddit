import z from "zod";

export interface likeOrDislikeCommentInputDTO {
  token: string;
  id: string;
  like: boolean;
}

export type likeOrDislikeCommentOutputDTO = undefined

export const likeOrDislikeCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as likeOrDislikeCommentInputDTO);
