import { FormEvent, useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CloseRounded, VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/auth.css";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal({
  signupOpen,
  loginOpen,
  handleSignupClose,
  handleLoginClose,
}: AuthenticationModalProps) {
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthMember } = useGlobals();

  const resetForm = () => {
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setShowPassword(false);
  };

  const closeLogin = () => {
    resetForm();
    handleLoginClose();
  };

  const closeSignup = () => {
    resetForm();
    handleSignupClose();
  };

  const handleSignupRequest = async (event?: FormEvent) => {
    event?.preventDefault();
    try {
      if (!memberNick.trim() || !memberPhone.trim() || !memberPassword) throw new Error(Messages.error3);
      setLoading(true);
      const input: MemberInput = { memberNick: memberNick.trim(), memberPhone: memberPhone.trim(), memberPassword };
      const member = await new MemberService().signup(input);
      setAuthMember(member);
      closeSignup();
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRequest = async (event?: FormEvent) => {
    event?.preventDefault();
    try {
      if (!memberNick.trim() || !memberPassword) throw new Error(Messages.error3);
      setLoading(true);
      const input: LoginInput = { memberNick: memberNick.trim(), memberPassword };
      const member = await new MemberService().login(input);
      setAuthMember(member);
      closeLogin();
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setLoading(false);
    }
  };

  const securityPanel = (
    <section className="auth-security" aria-hidden="true">
      <img className="auth-security-image" src="/img/newloginimage.png" alt="" />
      <div className="auth-security-overlay" />
      <div className="auth-security-copy"><strong>SECURE SIGN IN</strong><span>Your account stays protected</span></div>
    </section>
  );

  const passwordField = (
    <label className="auth-field">
      <span>Password</span>
      <input type={showPassword ? "text" : "password"} value={memberPassword} onChange={(e) => setMemberPassword(e.target.value)} placeholder="Enter your password" autoComplete={signupOpen ? "new-password" : "current-password"} />
      <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</button>
    </label>
  );

  return (
    <>
      <Modal className="auth-modal" open={loginOpen} onClose={closeLogin} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 350 }}>
        <Fade in={loginOpen}>
          <div className="auth-card">
            {securityPanel}
            <section className="auth-form-panel">
              <button className="auth-close" type="button" onClick={closeLogin} aria-label="Close login"><CloseRounded /></button>
              <div className="auth-heading"><span>WELCOME BACK</span><h2>Log in to Techanor</h2><p>Access your orders, saved products and account.</p></div>
              <form className="auth-form" onSubmit={handleLoginRequest}>
                <label className="auth-field"><span>Username</span><input value={memberNick} onChange={(e) => setMemberNick(e.target.value)} placeholder="Enter your username" autoComplete="username" autoFocus /></label>
                {passwordField}
                <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Log in securely"}<span>→</span></button>
              </form>
            </section>
          </div>
        </Fade>
      </Modal>

      <Modal className="auth-modal" open={signupOpen} onClose={closeSignup} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 350 }}>
        <Fade in={signupOpen}>
          <div className="auth-card">
            {securityPanel}
            <section className="auth-form-panel">
              <button className="auth-close" type="button" onClick={closeSignup} aria-label="Close signup"><CloseRounded /></button>
              <div className="auth-heading"><span>CREATE ACCOUNT</span><h2>Join Techanor</h2><p>Create your profile and keep every order in one place.</p></div>
              <form className="auth-form" onSubmit={handleSignupRequest}>
                <label className="auth-field"><span>Username</span><input value={memberNick} onChange={(e) => setMemberNick(e.target.value)} placeholder="Choose a username" autoComplete="username" autoFocus /></label>
                <label className="auth-field"><span>Phone number</span><input value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} placeholder="Enter your phone number" autoComplete="tel" /></label>
                {passwordField}
                <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}<span>→</span></button>
              </form>
            </section>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
