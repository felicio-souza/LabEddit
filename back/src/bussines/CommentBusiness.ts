import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { PostDataBase } from "../database/PostDataBase";
import { GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/comment/GetComments.dto";
import { likeOrDislikeCommentInputDTO } from "../dtos/comment/LikeOrDislikeComment.dto";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { DeleteCommentInputDTO } from "../dtos/comment/deletePost.dto";
import { UpdateCommentInputDTO } from "../dtos/comment/updatePost.dto";
import { BadRequestError } from "../erros/BadRequestError";
import { NotFoundError } from "../erros/NotFoundError";
import { UnauthorizedError } from "../erros/UnauthorizedError";
import { Comment, CommentDB, CommentModel } from "../models/Comment";
import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";




export class CommentBusiness {

constructor(
    
    
    private postsDatabase: PostDataBase,
    private commentDatabase: CommentDatabase,
    private commentLikerOrDislikeDatabase: LikeDislikeCommentDatabase,
    private tokenManager: TokenManager,
    private idGenerator: IdGenerator){}

    public getComments = async (input: GetCommentInputDTO): Promise<GetCommentOutputDTO> => {
        
       const  {token, postId} = input

        const payload = this.tokenManager.getPayload(token) 

        if(!payload){

            throw new UnauthorizedError("token inválido")

        }
        const commentsDB = await this.commentDatabase.getComments()
        
        
        const commentModel: CommentModel[] = []

        for(let commentDB of commentsDB){
            const postDB = await this.commentDatabase.findCommentById(commentDB.post_id)

            const comment = new Comment(
                      commentDB.id,
                      commentDB.post_id,
                      commentDB.user_id,
                      commentDB.content,
                      commentDB.likes,
                      commentDB.dislikes,
                      commentDB.created_at,
                      commentDB.updated_at
                    );
        
            commentModel.push(comment.CommentToGetAllPost())
        }
        
      
        const output: GetCommentOutputDTO = commentModel

        return output
}


  public createCommentsByIdPost = async (input: CreateCommentInputDTO): Promise<string>=> {

    const { token, content, postId } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {

      throw new NotFoundError("Usuario não existe.");
    }

    const postDB = await this.postsDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError("Post não existe.");
    }

    if (postDB.creator_id === tokenPayload.id) {
      throw new BadRequestError(
        "It's not possible for the creator like or dislike your own comment."
      );
    }

    const id = this.idGenerator.generate();

    const newComment = new Comment(

        id,
        postDB.id,
        content,
        0,
        0,
        new Date().toISOString(),
        "",
        {
          id: tokenPayload.id,
          name: tokenPayload.name,
        }
    );

    const newCommentDB = newComment.CommentToDB();

    await this.commentDatabase.createComment(newCommentDB);

    return "comentario criado";
  };



  public editCommentsById = async (input: UpdateCommentInputDTO): Promise<string> => {
    const { token, id, content } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;

    const [commentDB] = await this.commentDatabase.findCommentById(id);

    if (!commentDB) {
      throw new NotFoundError("comment not found.");
    }

    if (commentDB.user_id !== userId) {
      throw new BadRequestError("Only user can change your own comment");
    }

    const newComment = new Comment(
      id,
      commentDB.post_id,
      content,
      0,
      0,
      commentDB.created_at,
      commentDB.updated_at,
      {
        id: tokenPayload.id,
        name: tokenPayload.name,
      }
    );

    newComment.UPDATEDAT = new Date().toISOString();
    content && (newComment.CONTENT = content);

    const updatePostDB = newComment.CommentToDB();

    await this.commentDatabase.editComment(updatePostDB, id);

    return "Comment updated.";
  };

  public deleteCommentsById = async (
    commentForDelete: DeleteCommentInputDTO
  ): Promise<string> => {
    const { token, id } = commentForDelete;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const [commentDB] = await this.commentDatabase.findCommentById(id);

    if (!commentDB) {
      throw new NotFoundError("comment not found.");
    }

    if (commentDB.user_id !== tokenPayload.id) {
      throw new BadRequestError("Only user can delete your own comment");
    }

    await this.commentLikerOrDislikeDatabase.deleteLikeOrDislikeComment(id);

    await this.commentDatabase.deleteComment(id);

    return "Post deleted.";
  };

  public likeOrDislikeComments = async (
    postLikeOrDislike: likeOrDislikeCommentInputDTO
  ) => {
    const { token, id, like } = postLikeOrDislike;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;
    const idComment = id;

    let response: string;

    const likeDB: number = !like ? 0 : 1;

    let newUserLikeOrDislikeDB: LikeOrDislikeCommentDB = {
      id_user: userId,
      id_comment: idComment,
      like: likeDB,
    };

    const [commentLikedExistDB] =
      await this.commentLikerOrDislikeDatabase.findLikesAndDislikesById(
        userId,
        idComment
      );

    const [commentDB] = await this.commentDatabase.findCommentById(idComment);

    if (!commentDB) {
      throw new NotFoundError("Post não encontrado.");
    }

    if (commentDB.user_id === userId) {
      throw new BadRequestError(
        "Você não pode dar like no seu post."
      );
    }

    if (!commentLikedExistDB || commentLikedExistDB.id_comment !== idComment) {
      let updateComment;

      if (!like) {
        updateComment = { ...commentDB, dislikes: commentDB.dislikes + 1 };
      } else {
        updateComment = { ...commentDB, likes: commentDB.likes + 1 };
      }

      await this.commentDatabase.editComment(updateComment, idComment);

      await this.commentLikerOrDislikeDatabase.newLikeOrDislikeComment(
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    } else {
      let updateComment: CommentDB | undefined;

      if (!like && commentLikedExistDB.like === null) {
        updateComment = { ...commentDB, dislikes: commentDB.dislikes + 1 };
      } else if (like && commentLikedExistDB.like === null) {
        updateComment = { ...commentDB, likes: commentDB.likes + 1 };
      }

      if (likeDB === commentLikedExistDB.like) {
        likeDB === 0
          ? (updateComment = { ...commentDB, dislikes: commentDB.dislikes - 1 })
          : (updateComment = { ...commentDB, likes: commentDB.likes - 1 });

        newUserLikeOrDislikeDB = { ...newUserLikeOrDislikeDB, like: null };
      }

      if (likeDB === 0 && commentLikedExistDB.like === 1) {
        updateComment = {
          ...commentDB,
          dislikes: commentDB.dislikes + 1,
          likes: commentDB.likes - 1,
        };
      } else if (likeDB === 1 && commentLikedExistDB.like === 0) {
        updateComment = {
          ...commentDB,
          dislikes: commentDB.dislikes - 1,
          likes: commentDB.likes + 1,
        };
      }

      await this.commentDatabase.editComment(
        updateComment as CommentDB,
        idComment
      );

      await this.commentLikerOrDislikeDatabase.updateLikeOrDislikeComment(
        userId,
        idComment,
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    }

    return response;
  }; 
}