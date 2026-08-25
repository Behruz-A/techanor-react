import { Box, Container, Stack } from "@mui/material";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  if (!authMember) history.push("/");

  return <main className="user-page">
    <section className="account-hero"><div>
      <span>YOUR TECHANOR ACCOUNT</span>
      <h1>My <em>Profile</em></h1>
      <p>Keep your account details, delivery information and profile preferences accurate.</p>
    </div></section>
    <Container maxWidth={false} className="account-container">
      <Stack className="my-page-frame">
        <Stack className="my-page-left"><Box display="flex" flexDirection="column">
          <Box className="menu-name"><div><h2>Personal information</h2><p>Review and update the details connected to your Techanor account.</p></div></Box>
          <Box className="menu-content"><Settings /></Box>
        </Box></Stack>
        <aside className="member-page-burak-card">
          <img src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"} alt={authMember?.memberNick || "Profile"}/>
          <h2>{authMember?.memberNick}</h2>
          <span>{authMember?.memberType}</span>
          <div><LocationOnOutlined/><p>{authMember?.memberAddress || "Address not provided"}</p></div>
        </aside>
      </Stack>
    </Container>
  </main>;
}
