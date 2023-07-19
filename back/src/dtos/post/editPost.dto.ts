import z from "zod"

export interface EditPostInputDTO{
    token: string,
    content: string
    idToPostEdit: string

}

export type EditPostOutputDTO = undefined

export const EditPostSchema = z.object({

    token: z.string().min(2),
    content: z.string().min(6),
    idToPostEdit: z.string().min(1)
}).transform(data => data as EditPostInputDTO)