export interface IUserData {
    uid: string;
    name: string;
    email: string;
}

export class UserDataRequest {
    uid: string;
    name: string;
    email: string;

    constructor(uid: string, name: string, email: string) {
        this.uid = uid;
        this.name = name;
        this.email = email;
    }

    static fromInterface(data: IUserData): UserDataRequest {
        return new UserDataRequest(
            data.uid,
            data.name,
            data.email
        );
    }
}