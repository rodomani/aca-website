import { useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
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

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form status
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/");
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
              {t("auth.login.eyebrow")}
            </Typography>

            <Typography
              variant="h1"
              className="!text-4xl"
            >
              {t("auth.login.title")}
            </Typography>

            <Typography className="text-[#6B7280]">
              {t("auth.login.description")}
            </Typography>
          </div>

          {/* Login form */}
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
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
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
                ? t("auth.loggingIn")
                : t("auth.login.submit")}
            </Button>
          </form>

          {/* Registration link */}
          <Typography className="mt-6 !mb-0 text-center text-sm text-[#6B7280]">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-semibold text-[#1A3C2F] underline underline-offset-4"
            >
              {t("auth.login.registerLink")}
            </Link>
          </Typography>
        </section>
      </main>

      <Footer />
    </div>
  );
}