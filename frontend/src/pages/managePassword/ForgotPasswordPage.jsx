import { useState } from "react";
import { Input } from "../../components/ui/input";
import { useForgotPasswordMutation } from "../../slices/api/authApi";
import { toast } from "sonner";
import { LabelInputContainer } from "../../components/ui/LabelInputContainer";
import { CardContent } from "../../components/ui/card";
import { Card } from "../../components/testHistory/TestHistory";
import { Label } from "../../components/ui/label";
import { BottomGradient } from "../../components/ui/bottomGradient";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset link sent to your email");
    } catch {
      toast.error("Something went wrong. Please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-[var(--nav-bg)]">
        <CardContent className="p-6 space-y-4 text-[var(--text-color)] dark:text-white">
          <h2 className="text-3xl font-bold text-center text-[var(--text-color)]">
            Reset Password
          </h2>
          <p className="text-md text-center text-[var(--text-color)]/80">
            A reset link will be sent to this email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <LabelInputContainer>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  `Send Link`
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
