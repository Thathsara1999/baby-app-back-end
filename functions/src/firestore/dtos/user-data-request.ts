export interface IUserData {
    uid: string;
    name: string;
    email: string;
    role?: "midwife" | "admin";
    area?: string;
}

export class UserDataRequest {
    uid: string;
    name: string;
    email: string;
    role: "midwife" | "admin";
    area: string;

    constructor(
        uid: string,
        name: string,
        email: string,
        role: "midwife" | "admin" = "midwife",
        area: string = ""
    ) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.role = role;
        this.area = area;
    }

    static fromInterface(data: IUserData): UserDataRequest {
        return new UserDataRequest(
            data.uid,
            data.name,
            data.email,
            data.role ?? "midwife",
            data.area ?? ""
        );
    }
}