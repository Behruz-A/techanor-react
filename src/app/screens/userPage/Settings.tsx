import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { replaceBrokenImage, resolveMediaUrl } from "../../../lib/utils/media";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? resolveMediaUrl(authMember.memberImage)
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
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState("");
  const previewUrlRef = useRef<string | null>(null);
  const originalImage = resolveMediaUrl(authMember?.memberImage, "/icons/default-user.svg");

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  /**HANDLERS */
  const updateField = (field: keyof MemberUpdateInput) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setMemberUpdateInput((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmitButton = async () => {
    try {
      if (isSaving) return;
      setIsSaving(true);
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === ""
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
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setMemberImage(resolveMediaUrl(result.memberImage, "/icons/default-user.svg"));
      setMemberUpdateInput((current) => ({ ...current, memberImage: result.memberImage }));
      setSelectedImageName("");
      setIsEditing(false);

      await sweetTopSmallSuccessAlert("Modified successfully!", 700);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setMemberUpdateInput({ memberNick: authMember?.memberNick, memberPhone: authMember?.memberPhone, memberPassword: authMember?.memberPassword, memberAddress: authMember?.memberAddress, memberDesc: authMember?.memberDesc, memberImage: authMember?.memberImage });
    setMemberImage(originalImage);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setSelectedImageName("");
    setIsEditing(false);
  };

  const handleImageViewer = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validateImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validateImageTypes.includes(file.type)) {
      sweetErrorHandling("Choose a JPG, PNG or WebP image.").then();
      event.target.value = "";
    } else if (file.size > 5 * 1024 * 1024) {
      sweetErrorHandling("Profile image must be smaller than 5 MB.").then();
      event.target.value = "";
    } else {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setMemberUpdateInput((current) => ({ ...current, memberImage: file }));
      setMemberImage(previewUrl);
      setSelectedImageName(file.name);
    }
  };

  return (
    <Box className={"settings"}>
      <Box className="edit-profile-row"><div><strong>Account details</strong><span>{isEditing ? "Editing is enabled. Review your details before saving." : "Your personal and delivery information is securely stored."}</span></div><Button className="edit-profile-button" onClick={() => setIsEditing(true)} disabled={isEditing}>Edit profile</Button></Box>
      <Box className={"member-media-frame"}>
        <Button className="avatar-upload" component="label" aria-label="Change profile picture" disabled={!isEditing}>
          <img src={memberImage} className={"mb-image"} alt="Profile" onError={(event) => replaceBrokenImage(event, "/icons/default-user.svg")} />
          <span className="avatar-camera"><PhotoCameraOutlinedIcon /></span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageViewer} hidden />
        </Button>
        <div className={"media-change-box"}>
          <span>Profile photo</span>
          <p>JPG, PNG or WebP up to 5 MB. Square images work best.</p>
          {selectedImageName && <small className="avatar-file-ready">Ready to upload · {selectedImageName}</small>}
          <div className={"up-del-box"}>
            <Button component="label" disabled={!isEditing}>
              <CloudDownloadIcon /><span>Change photo</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageViewer} hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Display name</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder="Add your display name"
            value={memberUpdateInput.memberNick ?? ""}
            name="memberNick"
            onChange={updateField("memberNick")}
            disabled={!isEditing}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone number</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder="Add your phone number"
            value={memberUpdateInput.memberPhone ?? ""}
            name="memberPhone"
            onChange={updateField("memberPhone")}
            disabled={!isEditing}
          />
          <small className="field-helper">Use international format, e.g. +82 10-1234-5678.</small>
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder="Add your address"
            value={memberUpdateInput.memberAddress ?? ""}
            name="memberAddress"
            onChange={updateField("memberAddress")}
            disabled={!isEditing}
          />
          <small className="field-helper">Used as your default checkout address.</small>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>About you</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder="Tell us a little about yourself"
            value={memberUpdateInput.memberDesc ?? ""}
            name="memberDesc"
            onChange={updateField("memberDesc")}
            disabled={!isEditing}
            rows={3}
          />
          <small className="field-helper">A short introduction shown on your profile.</small>
        </div>
      </Box>
      {isEditing && <Box className={"save-box"}>
        <Button className="discard-button" onClick={handleDiscardChanges}>Cancel</Button>
        <Button variant={"contained"} onClick={handleSubmitButton} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </Box>}
    </Box>
  );
}
