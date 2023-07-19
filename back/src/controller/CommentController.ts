import { CommentBusiness } from "../bussines/CommentBusiness";
import { Request, Response } from "express";
import { CreateCommentScheme } from "../dtos/comment/createComment.dto";
import { ZodError } from "zod";
import { BaseError } from "../erros/BaseError";
import { UpdateCommentScheme } from "../dtos/comment/updatePost.dto";
import { DeleteCommentScheme } from "../dtos/comment/deletePost.dto";
import { likeOrDislikeCommentScheme } from "../dtos/comment/LikeOrDislikeComment.dto";
import { GetCommentSchema } from "../dtos/comment/GetComments.dto";

export class CommnetController {
    constructor(private commentBusiness: CommentBusiness) {}



    public getComments = async (req: Request, res: Response ) => {
        try {
            const input = GetCommentSchema.parse({

                token: req.headers.authorization
               
            })

            const output = await this.commentBusiness.getComments(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)

            }else if(error instanceof BaseError){

                res.status(error.statusCode).send(error.message)

            }else{

                res.status(500).send("Error inesperado")
            }
        }
    }
  
    createComment = async (req: Request, res: Response) => {
      try {
        const userComment = CreateCommentScheme.parse({
          token: req.headers.authorization,
          content: req.body.content,
          postId: req.params.id
        });
  
        const result = await this.commentBusiness.createCommentsByIdPost(
          userComment
        );
  
        res.status(200).send(result);
      } catch (error) {
        console.log(error);
  
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(500).send("erro inesperado");
        }
      }
    };
  
    editComment = async (req: Request, res: Response) => {
      try {
        const intensForUpdate = UpdateCommentScheme.parse({
          token: req.headers.authorization,
          id: req.params.id,
          content: req.body.content,
        });
  
        const response = await this.commentBusiness.editCommentsById(
          intensForUpdate
        );
  
        res.status(200).send(response);
      } catch (error) {
        console.log(error);
  
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(500).send("erro inesperado");
        }
      }
    };
  
    deleteComment = async (req: Request, res: Response) => {
      try {
        const CommentForDelete = DeleteCommentScheme.parse({
          token: req.headers.authorization,
          id: req.params.id,
        });
  
        const response = await this.commentBusiness.deleteCommentsById(
          CommentForDelete
        );
  
        res.status(200).send(response);
      } catch (error) {
        console.log(error);
  
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(500).send("erro inesperado");
        }
      }
    };
  
    likesOrDislikesComment = async (req: Request, res: Response) => {
      try {
        const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
          token: req.headers.authorization,
          id: req.params.id,
          like: req.body.like,
        });
  
        const response = await this.commentBusiness.likeOrDislikeComments(
          commentLikeOrDislike
        );
  
        res.status(200).send(response);
      } catch (error) {
        console.log(error);
  
        if (error instanceof ZodError) {
          res.status(400).send(error.issues);
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message);
        } else {
          res.status(500).send("erro inesperado");
        }
      }
    };
  }
  