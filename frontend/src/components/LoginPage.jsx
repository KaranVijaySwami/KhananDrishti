import React, { useState, useContext, useEffect } from "react";
import { Shield, KeyRound, Lock, LogIn, AlertTriangle, Cpu } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const LoginPage = () => {
  const { login, error: contextError } = useContext(AuthContext);
  
  const [loginRole, setLoginRole] = useState("mine_official");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [subsidiary, setSubsidiary] = useState("SECL");
  const [dscEnabled, setDscEnabled] = useState(true);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync context error to local error state
  useEffect(() => {
    if (contextError) {
      setErrorMessage(contextError);
    }
  }, [contextError]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim()) {
      setErrorMessage("Please enter your EIS / Login ID.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Please enter your password or security token PIN.");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage("Incorrect security code. Please re-enter the code shown.");
      setCaptchaCode(generateCaptcha()); // Reset captcha on failure
      setCaptchaInput("");
      return;
    }

    setIsLoading(true);

    const success = await login(loginId, password, subsidiary, loginRole);
    
    if (!success) {
      setCaptchaCode(generateCaptcha()); // Regenerate captcha on failed auth
      setCaptchaInput("");
      setPassword(""); // Clear password for security
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#FF4D00] selection:text-white">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-xs px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-serif italic font-bold text-[#FF4D00] text-xl">ख</span>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] font-bold text-slate-500 uppercase">
              Govt. of India · Ministry of Coal · Coal India Ltd.
            </p>
            <h1 className="text-base font-serif italic text-slate-900 leading-tight">
              खाननदृष्टि{" "}
              <span className="font-sans text-[11px] not-italic text-slate-500 font-normal">
                · KhananDrishti Official Portal
              </span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 space-y-6">

            {/* Card Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 mb-1">
                <KeyRound className="w-5 h-5 text-[#E64A19]" />
              </div>
              <h2 className="text-xl font-serif text-slate-900">Official Sign-In</h2>
              <p className="text-xs text-slate-500 font-mono">
                Statutory Identity Gateway · Mines Act 1952 / CMR 2017
              </p>
            </div>

            {/* Error */}
            {errorMessage &&
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            }

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* Role */}
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Statutory Role
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/20">
                  
                  <option value="mine_official">Mine Official / Mines Manager</option>
                  <option value="corporate_hq">Corporate HQ / CIL Apex Command</option>
                  <option value="regulatory_authority">DGMS Statutory Inspector</option>
                  <option value="safety_officer">Colliery Safety Officer</option>
                  <option value="contractor_supervisor">Authorized Contractor Representative</option>
                </select>
              </div>

              {/* Subsidiary */}
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Subsidiary / Organization
                </label>
                <select
                  value={subsidiary}
                  onChange={(e) => setSubsidiary(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/20">
                  
                  <option value="SECL">SECL — South Eastern Coalfields</option>
                  <option value="ECL">ECL — Eastern Coalfields</option>
                  <option value="BCCL">BCCL — Bharat Coking Coal</option>
                  <option value="CCL">CCL — Central Coalfields</option>
                  <option value="NCL">NCL — Northern Coalfields</option>
                  <option value="MCL">MCL — Mahanadi Coalfields</option>
                  <option value="WCL">WCL — Western Coalfields</option>
                  <option value="CIL_HQ">CIL Apex HQ (Kolkata)</option>
                </select>
              </div>

              {/* EIS No */}
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  EIS / Login ID
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. SECL-MGR-4192 or EIS-90214432"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/20" />
                
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Password / Token PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter statutory passphrase"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-9 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/20" />
                  
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* DSC Token */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#E64A19]" />
                  <span className="text-[11px] font-mono text-slate-800 font-semibold">
                    Class-3 DSC Token
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dscEnabled}
                    onChange={(e) => setDscEnabled(e.target.checked)}
                    className="sr-only peer" />
                  
                  <div className="w-8 h-4 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#FF4D00]" />
                </label>
              </div>

              {/* Captcha */}
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Security Code
                  </label>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    maxLength={5}
                    placeholder="Enter code"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/20" />
                  
                </div>
                <div className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold tracking-[0.3em] text-[#E64A19] text-sm select-none shrink-0 line-through">
                  {captchaCode}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50">
                
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? "Verifying credentials..." : "Sign In to Portal"}</span>
              </button>
            </form>

            {/* Security notice */}
            <div className="pt-4 border-t border-slate-100 flex items-start space-x-2 text-[10px] text-slate-500 font-mono leading-relaxed">
              <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
              <p>
                Unauthorized access or fraudulent log submissions are cognizable offenses under Section 84, Mines Act 1952. All actions are cryptographically logged.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 h-10 flex items-center px-6 justify-between text-[10px] text-slate-500 uppercase tracking-[0.15em] font-semibold">
        <span>KhananDrishti · Coal Sector Compliance Platform</span>
        <span className="hidden sm:inline font-mono text-slate-400">SHA-256 Audit Logs Active</span>
      </footer>
    </div>);

};