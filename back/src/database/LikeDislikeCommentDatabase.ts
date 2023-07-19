import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { BaseDataBase } from "./BaseDataBase";

export class LikeDislikeCommentDatabase extends BaseDataBase{


    private static LIKESDISLIKECOMMENT_TABLE = "like_dislike_comment_post"

    findLikesAndDislikesById = async (
        id_user: string,
        id_comment: string
      ): Promise<LikeOrDislikeCommentDB[]> => {
        const commentLikeDB = await BaseDataBase.connection(
          LikeDislikeCommentDatabase.LIKESDISLIKECOMMENT_TABLE
        )
          .where({ id_user })
          .andWhere({ id_comment });
    
        return commentLikeDB;
      };
    
      findLikesAndDislikesByIdComment = async (
        id_comment: string
      ): Promise<LikeOrDislikeCommentDB[]> => {
        const commentLikeDB = await BaseDataBase.connection(
          LikeDislikeCommentDatabase.LIKESDISLIKECOMMENT_TABLE
        ).where({ id_comment });
    
        return commentLikeDB;
      };
    
      newLikeOrDislikeComment = async (
        newLikeComment: LikeOrDislikeCommentDB
      ): Promise<void> => {
        await BaseDataBase.connection(
          LikeDislikeCommentDatabase.LIKESDISLIKECOMMENT_TABLE
        ).insert(newLikeComment);
      };
    
      updateLikeOrDislikeComment = async (
        id_user: string,
        id_comment: string,
        newLikeOrDislikeComment: any
      ): Promise<void> => {
        await BaseDataBase.connection(
          LikeDislikeCommentDatabase.LIKESDISLIKECOMMENT_TABLE
        )
          .update(newLikeOrDislikeComment)
          .where({ id_comment })
          .andWhere({ id_user });
      };
    
      deleteLikeOrDislikeComment = async (id_comment: string): Promise<void> => {
        await BaseDataBase.connection(
          LikeDislikeCommentDatabase.LIKESDISLIKECOMMENT_TABLE
        )
          .del()
          .where({ id_comment });
      };
}