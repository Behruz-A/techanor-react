import { AuthProvider, MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberEmail?: string;
  googleId?: string;
  authProvider?: AuthProvider;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  // tokenni ichida cookilardan bilib olamiz object id ni

  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}
