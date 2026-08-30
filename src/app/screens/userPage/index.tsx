import { Box, Container, Stack } from "@mui/material";
import { Settings } from "./Settings";
import { Redirect } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MapPinIcon } from "../../components/icons/TechanorIcons";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import "../../../css/userPage.css";

export default function UserPage() {
  const { authMember } = useGlobals();
  if (!authMember) return <Redirect to="/" />;

  return <main className="user-page">
    <Container maxWidth={false} className="account-container">
      <header className="account-page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account details.</p>
      </header>
      <Stack className="my-page-frame">
        <Stack className="my-page-left"><Box display="flex" flexDirection="column">
          <Box className="menu-name"><div><h2>Personal information</h2><p>Review and update the details connected to your Techanor account.</p></div></Box>
          <Box className="menu-content"><Settings /></Box>
        </Box></Stack>
        <aside className="member-page-burak-card">
          <img src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt={authMember?.memberNick || "Profile"}/>
          <h2>{authMember.memberNick}</h2>
          <span>{authMember.memberType}</span>
          <div><PhoneOutlined/><p>{authMember.memberPhone || "Phone not provided"}</p></div>
          <div><MapPinIcon /><p>{authMember?.memberAddress || "Address not provided"}</p></div>
        </aside>
      </Stack>
    </Container>
  </main>;
}
