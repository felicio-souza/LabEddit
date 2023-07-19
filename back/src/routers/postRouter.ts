import express from "express"
import { PostController } from "../controller/PostController"
import { PostBusiness } from "../bussines/PostBusiness"
import { PostDataBase } from "../database/PostDataBase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { UserDataBase } from "../database/UserDataBase"
import { CommentBusiness } from "../bussines/CommentBusiness"
import { CommentDatabase } from "../database/CommentDatabase"
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase"
import { CommnetController } from "../controller/CommentController"



export const postRouter = express.Router()

export const postController = new PostController(

    new PostBusiness(

        new PostDataBase(),
        new UserDataBase(),
        new IdGenerator(),
        new TokenManager(),
    )
)

const commentController = new CommnetController(
    new CommentBusiness(
      new PostDataBase(),
      new CommentDatabase(),
      new LikeDislikeCommentDatabase(),
      new TokenManager(),
      new IdGenerator()
    )
  ); 

postRouter.get("/", postController.getPosts)

postRouter.post("/", postController.createPost)
postRouter.post("/:id/comment", commentController.createComment);



postRouter.put("/:id", postController.editPost)
postRouter.put("/:id/like", postController.likeOrDislikePost)

postRouter.delete("/:id", postController.deletePost)

