import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BottomGradient } from "../components/ui/bottomGradient";
import { LabelInputContainer } from "../components/ui/LabelInputContainer";
import { useLoginUserMutation } from "../slices/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
export default function LoginPage() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoadingBtn(true);
    const userData = await loginUser(data);
    setLoadingBtn(false);
  };
  useEffect(() => {
    if (loginIsSuccess) {
      toast.success(loginData?.message || "Welcome Back");
      navigate("/");
    } else if (loginError) {
      toast.error(
        loginError?.data?.message || "Some error occured. Please Try Again"
      );
    }
  }, [loginIsSuccess, loginError]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-[var(--nav-bg)]">
        <CardContent className="p-6 space-y-4 text-[var(--text-color)] dark:text-white">
          <h2 className="text-3xl font-bold text-center text-[var(--text-color)]">
            Login
          </h2>
          <p className="text-md text-center text-[var(--text-color)]/80">
            Log in to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <LabelInputContainer>
                <Label className="text-[var(--text-color)] text-sm font-medium">
                  Email
                </Label>

                <Input
                  placeholder="Enter your Email..."
                  type="email"
                  {...register("email", { required: true })}
                />
              </LabelInputContainer>
              {errors.email && (
                <span className="text-xs text-red-400 pl-1">
                  Email is required
                </span>
              )}
            </div>
            <div>
              <LabelInputContainer>
                <Label className="text-[var(--text-color)] text-sm font-medium">
                  Password
                </Label>
                <Input
                  placeholder="Enter Your Password..."
                  type="password"
                  {...register("password", { required: true })}
                />
              </LabelInputContainer>
              {errors.password && (
                <span className="text-xs text-red-400 pl-1">
                  Password is required
                </span>
              )}
            </div>
            <button
              className={`group/btn mt-6 relative flex h-11 w-full items-center justify-center space-x-2 rounded-lg px-4 font-medium text-white transition-colors duration-300 ${
                loadingBtn
                  ? "bg-[var(--btn-hover)] opacity-60 cursor-not-allowed"
                  : "bg-[var(--btn-bg)] cursor-pointer hover:bg-[var(--btn-hover)]"
              }`}
              type="submit"
            >
              {loadingBtn ? (
                <>
                  <Loader2 className="animate-spin" /> Please Wait
                </>
              ) : (
                `Login`
              )}
              <BottomGradient />
            </button>
          </form>
          <p className="text-sm text-center text-[var(--text-color)]/80">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer text-[var(--btn-bg)] hover:text-[var(--btn-hover)] transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
          <p className="text-sm text-center text-[var(--text-color)]/80">
            <span
              className="underline cursor-pointer text-[var(--btn-bg)] hover:text-[var(--btn-hover)] transition"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
