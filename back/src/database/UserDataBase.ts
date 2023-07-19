import { UserDB } from "../models/User";
import { BaseDataBase } from "./BaseDataBase";




export class UserDataBase extends BaseDataBase{

    public static TABLE_USERS = "users"
    
    public insertUser = async (userDB: UserDB): Promise<void> => {
        await BaseDataBase
        .connection(UserDataBase.TABLE_USERS)
        .insert(userDB)
    }


    public findUserByEmail = async (email: string): Promise<UserDB | undefined>=> {
     
       const [userDB] = await BaseDataBase
       .connection(UserDataBase.TABLE_USERS)
       .select()
       .where({email})

       return userDB as UserDB | undefined
    }

    public findById = async (id: string): Promise<UserDB>=> {
     
        const [userDB] = await BaseDataBase
        .connection(UserDataBase.TABLE_USERS)
        .select()
        .where({id:id})
 
        return userDB
     }
}