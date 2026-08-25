import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg",
  );
  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberPassword: authMember?.memberPassword,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    },
  );
  const [isEditing, setIsEditing] = useState(false);
  const originalImage = authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg";

  /**HANDLERS */
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescriptionHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }
      const phone = memberUpdateInput.memberPhone?.replace(/[\s()-]/g, "") || "";
      if (!/^\+?\d{8,15}$/.test(phone)) {
        throw new Error("Please enter a valid phone number, for example +82 10-1234-5678.");
      }
      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);
      setIsEditing(false);

      await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleDiscardChanges = () => {
    setMemberUpdateInput({ memberNick: authMember?.memberNick, memberPhone: authMember?.memberPhone, memberPassword: authMember?.memberPassword, memberAddress: authMember?.memberAddress, memberDesc: authMember?.memberDesc, memberImage: authMember?.memberImage });
    setMemberImage(originalImage);
    setIsEditing(false);
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileType = file.type,
      validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        memberUpdateInput.memberImage = file;
        setMemberUpdateInput({ ...memberUpdateInput });
        setMemberImage(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <Button className="avatar-upload" component="label" onChange={handleImageViewer} aria-label="Change profile picture" disabled={!isEditing}>
          <img src={memberImage} className={"mb-image"} alt="Profile" />
          <span className="avatar-camera"><PhotoCameraOutlinedIcon /></span>
          <input type="file" accept="image/jpeg,image/png" hidden />
        </Button>
        <div className={"media-change-box"}>
          <span>Profile picture</span>
          <p>JPG, JPEG or PNG. Shown across your Techanor account.</p>
          <div className={"up-del-box"}>
            <Button component="label" onChange={handleImageViewer} disabled={!isEditing}>
              <CloudDownloadIcon /><span>Change photo</span>
              <input type="file" accept="image/jpeg,image/png" hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className="edit-profile-row"><div><strong>Profile details</strong><span>{isEditing ? "You can now update your information." : "Your information is protected until editing is enabled."}</span></div><Button className="edit-profile-button" onClick={() => setIsEditing(true)} disabled={isEditing}>Edit profile</Button></Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
            disabled={!isEditing}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
            disabled={!isEditing}
          />
          <small className="field-helper">Use international format, e.g. +82 10-1234-5678</small>
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={authMember?.memberAddress || "no address"}
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAddressHandler}
            disabled={!isEditing}
          />
          <small className="field-helper">Used as your default delivery address</small>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={
              authMember?.memberDesc ? authMember.memberDesc : "no description"
            }
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDescriptionHandler}
            disabled={!isEditing}
            rows={3}
          />
          <small className="field-helper">A short introduction, up to a few sentences</small>
        </div>
      </Box>
      {isEditing && <Box className={"save-box"}>
        <Button className="discard-button" onClick={handleDiscardChanges}>Discard changes</Button>
        <Button variant={"contained"} onClick={handleSubmitButton}>
          Save changes
        </Button>
      </Box>}
    </Box>
  );
}
