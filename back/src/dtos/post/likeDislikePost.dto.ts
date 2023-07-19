import z from "zod"

export interface LikeDislikePostInputDTO{

    token: string,
    postId: string,   
    like: boolean
}

export type LikeDislikePostOutputDTO = undefined



export const LikeDislikePostSchema = z.object({
    token: z.string().min(2),
    postId: z.string().min(2),
    like: z.boolean()
}).transform(data => data as LikeDislikePostInputDTO)