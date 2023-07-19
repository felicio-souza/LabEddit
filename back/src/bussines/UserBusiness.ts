import { UserDataBase } from "../database/UserDataBase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/logindto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signupdto";
import { BadRequestError } from "../erros/BadRequestError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDataBase: UserDataBase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const hashPassword = await this.hashManager.hash(password);

    const user = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const userDB = user.toDBModel();
    await this.userDataBase.insertUser(userDB);

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      token,
    };
    
    return output;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDataBase.findUserByEmail(email);

    if (!userDB) {
      throw new BadRequestError("email ou senhas invalidos ");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const hashPassword = user.getPassword();

    const isPasswordCorret = await this.hashManager.compare(
      password,
      hashPassword
    );

    if (!isPasswordCorret) {
      throw new BadRequestError("email ou senhas invalidos ");
    }

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: LoginOutputDTO = {
      token,
    };
    return output;
  };
}
