import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const url = this.path + "/signup";
    const result = await axios.post<{ member: Member }>(url, input, { withCredentials: true });
    const member = result.data.member;

    localStorage.setItem("memberData", JSON.stringify(member));

    return member;
  }

  public async login(input: LoginInput): Promise<Member> {
    const url = this.path + "/login";
    const result = await axios.post<{ member: Member }>(url, input, { withCredentials: true });
    const member = result.data.member;

    localStorage.setItem("memberData", JSON.stringify(member));

    return member;
  }

  public async getCurrentMember(): Promise<Member> {
    const url = this.path + "/member/me";
    const result = await axios.get<{ member: Member }>(url, { withCredentials: true });
    const member = result.data.member;
    localStorage.setItem("memberData", JSON.stringify(member));
    return member;
  }

  public async logout(): Promise<void> {
    try {
      await axios.post(this.path + "/logout", undefined, { withCredentials: true });
    } finally {
      localStorage.removeItem("memberData");
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    const formData = new FormData();
    formData.append("memberNick", input.memberNick || "");
    formData.append("memberPhone", input.memberPhone || "");
    formData.append("memberAddress", input.memberAddress || "");
    formData.append("memberDesc", input.memberDesc || "");
    if (input.memberImage instanceof File) formData.append("memberImage", input.memberImage);

    const result = await axios.post<Member>(`${serverApi}/member/update`, formData, {
      withCredentials: true,
    });

    const member = result.data;
    localStorage.setItem("memberData", JSON.stringify(member));
    return member;
  }
}

export default MemberService;
