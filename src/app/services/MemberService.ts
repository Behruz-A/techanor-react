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

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/member/top-users";
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  public async getRestaurant(): Promise<Member> {
    try {
      const url = this.path + "/member/restaurant";
      const result = await axios.get(url);
      const restaurant: Member = result.data;
      return restaurant;
    } catch (err) {
      throw err;
    }
  }

  // localstorage ga ham member datani yozvoldik ==? brauzerni ixtiyoriy
  // burchagida authenticatet bolgan memberni malumotlari kerak boladi image, etc
  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      const member: Member = result.data.member;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/login";

      const result = await axios.post(url, input, { withCredentials: true }); // backend frontendga cookie ni joyledi
      const member: Member = result.data.member;

      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      throw err;
    }
  }

  public async getCurrentMember(): Promise<Member> {
    const url = this.path + "/member/me";
    const result = await axios.get(url, { withCredentials: true });
    const member: Member = result.data.member;
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
    try {
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      if (input.memberImage instanceof File) formData.append("memberImage", input.memberImage);

      const result = await axios(`${serverApi}/member/update`, {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      throw err;
    }
  }
}

export default MemberService;
