import { useState } from "react";
import type { FormEvent } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { Typography } from "../components/ui/Typography";

import { supabase } from "../utils/supabase";

const inputClassName = [
  "mt-2 w-full",
  "border border-[#E2DEC6]",
  "bg-[#F4F1E9]/30",
  "px-3 py-3",
  "text-[#2C2C2C]",
  "outline-none transition",
  "focus:border-[#1A3C2F]",
].join(" ");

export function Register() {
  const { t } = useTranslation();

  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // Form status
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    // Check that both passwords match
    if (password !== confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);

    const { error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            `${window.location.origin}/login`,
        },
      });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setIsComplete(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />

      <main className="container mx-auto flex flex-grow items-center px-4 py-16 md:px-8">
        <section className="mx-auto w-full max-w-md border border-[#E2DEC6] bg-white p-6 md:p-10">
          {/* Page heading */}
          <div>
            <Typography
              variant="h4"
              className="text-[#1A3C2F]/70"
            >
              {t("auth.register.eyebrow")}
            </Typography>

            <Typography
              variant="h1"
              className="!text-4xl"
            >
              {t("auth.register.title")}
            </Typography>

            <Typography className="text-[#6B7280]">
              {t("auth.register.description")}
            </Typography>
          </div>

          {isComplete ? (
            /* Registration success message */
            <div className="mt-8 border-l-4 border-[#1A3C2F] bg-[#F4F1E9] p-5">
              <Typography
                variant="h3"
                className="!text-xl"
              >
                {t("auth.register.successTitle")}
              </Typography>

              <Typography className="!mb-0 text-[#6B7280]">
                {t("auth.register.successDescription")}
              </Typography>
            </div>
          ) : (
            /* Registration form */
            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <label className="block text-sm font-medium text-[#1A3C2F]">
                {t("auth.email")}

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  className={inputClassName}
                />
              </label>

              {/* Password */}
              <label className="block text-sm font-medium text-[#1A3C2F]">
                {t("auth.password")}

                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </label>

              {/* Confirm password */}
              <label className="block text-sm font-medium text-[#1A3C2F]">
                {t("auth.confirmPassword")}

                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </label>

              {/* Error message */}
              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("auth.register.submitting")
                  : t("auth.register.submit")}
              </Button>
            </form>
          )}

          {/* Login link */}
          <Typography className="mt-6 !mb-0 text-center text-sm text-[#6B7280]">
            {t("auth.register.hasAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-[#1A3C2F] underline underline-offset-4"
            >
              {t("auth.register.loginLink")}
            </Link>
          </Typography>
        </section>
      </main>

      <Footer />
    </div>
  );
}