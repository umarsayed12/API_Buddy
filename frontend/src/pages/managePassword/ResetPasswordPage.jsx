import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { useResetPasswordMutation } from "../../slices/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { LabelInputContainer } from "../../components/ui/LabelInputContainer";
import { BottomGradient } from "../../components/ui/bottomGradient";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired token. Please try again.");
      navigate("/forgot-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-[var(--nav-bg)]">
        <CardContent className="p-6 space-y-4 text-[var(--text-color)] dark:text-white">
          <h2 className="text-3xl font-bold text-center text-[var(--text-color)]">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <LabelInputContainer>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
              </LabelInputContainer>
              <button
                className={`group/btn mt-6 relative flex h-11 w-full items-center justify-center space-x-2 rounded-lg px-4 font-medium text-white transition-colors duration-300 ${
                  isLoading
                    ? "bg-[var(--btn-hover)] opacity-60 cursor-not-allowed"
                    : "bg-[var(--btn-bg)] cursor-pointer hover:bg-[var(--btn-hover)]"
                }`}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Please Wait
                  </>
                ) : (
                  `Reset Password`
                )}
                <BottomGradient />
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
