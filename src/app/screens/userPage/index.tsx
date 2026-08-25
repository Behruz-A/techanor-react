import { Box, Container, Stack } from "@mui/material";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  if (!authMember) history.push("/");

  return <main className="user-page">
    <section className="account-hero"><div>
      <span>YOUR TECHANOR ACCOUNT</span>
      <h1>My <em>Profile</em></h1>
      <p>Manage your personal information and keep your Techanor account up to date.</p>
    </div></section>
    <Container maxWidth={false} className="account-container">
      <Stack className="my-page-frame">
        <Stack className="my-page-left"><Box display="flex" flexDirection="column">
          <Box className="menu-name"><div><h2>Personal Information</h2><p>Manage your personal information and delivery details.</p></div></Box>
          <Box className="menu-content"><Settings /></Box>
        </Box></Stack>
        <aside className="profile-summary-card">
          <div className="profile-summary-avatar"><img src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt={authMember?.memberNick || "Profile"}/><span><img src={authMember?.memberType === MemberType.STORE ? "/icons/restaurant.svg" : "/icons/user-badge.svg"} alt=""/></span></div>
          <h2>{authMember?.memberNick}</h2><b>{authMember?.memberType}</b>
          <div className="profile-summary-row"><PhoneOutlined/><div><small>PHONE NUMBER</small><span>{authMember?.memberPhone || "Not provided"}</span></div></div>
          <div className="profile-summary-row"><LocationOnOutlined/><div><small>DELIVERY ADDRESS</small><span>{authMember?.memberAddress || "Not provided"}</span></div></div>
          <p>{authMember?.memberDesc || "No profile description yet."}</p>
        </aside>
      </Stack>
    </Container>
  </main>;
}
