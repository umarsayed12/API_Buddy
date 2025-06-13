import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BottomGradient } from "../components/ui/bottomGradient";
import { LabelInputContainer } from "../components/ui/LabelInputContainer";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../slices/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
export default function SignupPage() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
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
    const user = await registerUser(data);
    if (user) {
      await loginUser(data);
      setLoadingBtn(false);
    }
  };
  useEffect(() => {
    if (registerIsSuccess) {
      toast.success(registerData?.message || "Account created Successfully.");
    } else if (registerError) {
      toast.error(
        registerError?.data?.message ||
          "Some error occured. Please SignUp Again."
      );
    }
    if (loginIsSuccess) {
      toast.success("Welcome to API Buddy.");
      navigate("/");
    } else if (loginError) {
      toast.error("Some error occured. Please Login Again.");
      navigate("/login");
    }
  }, [loginIsSuccess, loginError]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-[var(--nav-bg)]">
        <CardContent className="p-6 space-y-1">
          <h2 className="text-3xl font-bold text-center text-[var(--text-color)]">
            Sign Up
          </h2>
          <p className="text-md text-center text-[var(--text-color)]/80">
            Hey there. Register your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <LabelInputContainer>
                <Label className="text-[var(--text-color)] text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  placeholder="Sayed Sahab"
                  type="text"
                  {...register("name", { required: true })}
                />
              </LabelInputContainer>
              {errors.name && (
                <span className="text-xs text-red-400 pl-1">
                  Full Name is required
                </span>
              )}
            </div>
            <div>
              <LabelInputContainer>
                <Label className="text-[var(--text-color)] text-sm font-medium">
                  Email
                </Label>
                <Input
                  placeholder="xyz@gmail.com"
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email address",
                    },
                  })}
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
                  placeholder="pass@4325"
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                />
              </LabelInputContainer>
              {errors.password && (
                <span className="text-xs text-red-400 pl-1">
                  Password must be at least 6 characters
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
                `Create Account`
              )}
              <BottomGradient />
            </button>
          </form>
          <p className="text-sm text-center text-[var(--text-color)]/80">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-[var(--btn-bg)] hover:text-[var(--btn-hover)] transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
