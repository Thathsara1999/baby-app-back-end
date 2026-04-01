import { UserService } from "../services/user-service";
import { UserDataRequest } from "../firestore/dtos/user-data-request";

export class UserRegisterLogic {
    constructor(private userService: UserService) { }

    async saveUserData(user: UserDataRequest) {
        await this.userService.saveUser(user);
    }
}