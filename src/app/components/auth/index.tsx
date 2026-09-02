import { FormEvent, useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  LockOutlined,
  PersonOutlineRounded,
  PhoneOutlined,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import BrandLogo from "../BrandLogo";
import "../../../css/auth.css";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  showSignup: () => void;
  showLogin: () => void;
}

export default function AuthenticationModal({
  signupOpen,
  loginOpen,
  handleSignupClose,
  handleLoginClose,
  showSignup,
  showLogin,
}: AuthenticationModalProps) {
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthMember } = useGlobals();
  const isSignup = signupOpen;
  const isOpen = signupOpen || loginOpen;

  const resetForm = () => {
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setShowPassword(false);
  };

  const close = () => {
    resetForm();
    if (signupOpen) handleSignupClose();
    if (loginOpen) handleLoginClose();
  };

  const handleSignupRequest = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const normalizedNick = memberNick.trim();
      const normalizedPhone = memberPhone.replace(/[\s()-]/g, "");
      if (!/^[A-Za-z0-9_]{2,30}$/.test(normalizedNick)) throw new Error("Username must be 2 to 30 characters and use only letters, numbers, or underscores.");
      if (!/^\+?\d{7,15}$/.test(normalizedPhone)) throw new Error("Enter a valid phone number containing 7 to 15 digits.");
      if (memberPassword.length < 6 || memberPassword.length > 72) throw new Error("Password must be between 6 and 72 characters.");
      setLoading(true);
      const input: MemberInput = {
        memberNick: normalizedNick,
        memberPhone: normalizedPhone,
        memberPassword,
      };
      const member = await new MemberService().signup(input);
      setAuthMember(member);
      close();
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRequest = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!memberNick.trim() || !memberPassword) throw new Error(Messages.error3);
      setLoading(true);
      const input: LoginInput = { memberNick: memberNick.trim(), memberPassword };
      const member = await new MemberService().login(input);
      setAuthMember(member);
      close();
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setLoading(false);
    }
  };

  const changeMode = () => {
    resetForm();
    if (isSignup) showLogin();
    else showSignup();
  };

  return (
    <Modal className="auth-modal" open={isOpen} onClose={close} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 300 }} aria-labelledby="auth-title">
      <Fade in={isOpen}>
        <div className="auth-stage">
          <div className="auth-card">
            <section className="auth-form-panel">
              <div className="auth-brand"><BrandLogo tone="dark" /></div>
              <button className="auth-back" type="button" onClick={close}><ArrowBackRounded /> Back to store</button>
              <div className="auth-heading">
                <h2 id="auth-title">{isSignup ? "Create your account" : "Sign in"}</h2>
                <p>{isSignup ? "Join Techanor to save products and manage your orders." : "Welcome back. Enter your Techanor account details."}</p>
              </div>

              <form className="auth-form" onSubmit={isSignup ? handleSignupRequest : handleLoginRequest}>
                <label className="auth-field"><span>Username</span><div className="auth-input-wrap"><PersonOutlineRounded aria-hidden="true" /><input value={memberNick} onChange={(event) => setMemberNick(event.target.value)} placeholder={isSignup ? "Choose a username" : "Enter your username"} autoComplete="username" minLength={2} maxLength={30} required autoFocus /></div></label>
                {isSignup && <label className="auth-field"><span>Phone number</span><div className="auth-input-wrap"><PhoneOutlined aria-hidden="true" /><input type="tel" value={memberPhone} onChange={(event) => setMemberPhone(event.target.value)} placeholder="e.g. +82 10-1234-5678" autoComplete="tel" required /></div></label>}
                <label className="auth-field"><span>Password</span><div className="auth-input-wrap"><LockOutlined aria-hidden="true" /><input type={showPassword ? "text" : "password"} value={memberPassword} onChange={(event) => setMemberPassword(event.target.value)} placeholder="Enter your password" autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 6 : undefined} maxLength={72} required /><button type="button" className="auth-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</button></div></label>
                <button className="auth-submit" type="submit" disabled={loading}>{loading ? (isSignup ? "Creating account…" : "Signing in…") : (isSignup ? "Create account" : "Sign in")}{!loading && <ArrowForwardRounded aria-hidden="true" />}</button>
              </form>

              <p className="auth-switch">{isSignup ? "Already have an account?" : "Don’t have an account?"} <button type="button" onClick={changeMode}>{isSignup ? "Sign in" : "Sign up"}</button></p>
            </section>
            <aside className="auth-benefits">
              <div className="auth-benefits-heading">
                <span>YOUR TECH, YOUR ACCOUNT</span>
                <h2>Make the most of Techanor</h2>
                <p>Keep your shopping journey organized from discovery to delivery.</p>
              </div>
              <div className="auth-benefit-list">
                <article><span>01</span><h3>Manage every order</h3><p>Review active, completed and cancelled orders from one place.</p></article>
                <article><span>02</span><h3>Save products you love</h3><p>Build your wishlist and return to your favourite technology anytime.</p></article>
                <article><span>03</span><h3>Checkout faster</h3><p>Reuse your account details for a smoother purchase and delivery experience.</p></article>
              </div>
            </aside>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
