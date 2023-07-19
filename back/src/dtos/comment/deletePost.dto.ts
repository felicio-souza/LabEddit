import z from "zod";

export interface DeleteCommentInputDTO {
  token: string;
  id: string;
}

export type DeleteCommentOutputDTO = undefined

export const DeleteCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1),
  })
  .transform((data) => data as DeleteCommentInputDTO);
