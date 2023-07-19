import { CommentDB } from "../models/Comment";
import { BaseDataBase } from "./BaseDataBase";

export class CommentDatabase extends BaseDataBase{

    private static COMMENTPOST_TABLE = "comment_post"



    public getComments = async (): Promise<CommentDB[]> => {

        return BaseDataBase.connection(CommentDatabase.COMMENTPOST_TABLE)
    }


    
    findCommentById = async (id: string): Promise<CommentDB[]> => {

        const commentsDB: CommentDB[] = await BaseDataBase
        .connection(CommentDatabase.COMMENTPOST_TABLE
        ).where({ id });
    
        return commentsDB;
      };
    
      findCommentByIdPost = async (id_post: string): Promise<CommentDB[]> => {
        const commentsDB: CommentDB[] = await BaseDataBase
        .connection(CommentDatabase.COMMENTPOST_TABLE
        ).where({ id_post });
    
        return commentsDB;
      };
    
      createComment = async (newComment: CommentDB): Promise<void> => {
        await BaseDataBase
        .connection(CommentDatabase.COMMENTPOST_TABLE)
        .insert(
          newComment
        );
      };
    
      editComment = async (newComment: CommentDB, id: string): Promise<any> => {
        await BaseDataBase
        .connection(CommentDatabase.COMMENTPOST_TABLE)
          .update(newComment)
          .where({ id });
      };
    
      deleteComment = async (id: string): Promise<any> => {
        await BaseDataBase
        .connection(CommentDatabase.COMMENTPOST_TABLE)
          .del()
          .where({ id });
      };
}