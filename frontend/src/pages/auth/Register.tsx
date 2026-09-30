import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../utils/constants";
import { getErrorMessage } from "../../utils/format";
import { getRedirectPath } from "../../utils/redirect";

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectPath(location.state);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError("Name must be 2-50 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setIsSubmitting(true);
    register({ name: trimmedName, email: email.trim(), password })
      .then(() => {
        toast.success("Account created");
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <Card>
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <UserPlus size={28} />
              </div>
              <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
              <p className="mt-1 text-sm text-ink-500">Join {APP_NAME} and start chatting</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                autoComplete="name"
                value={name}
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                hint="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                Sign up
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-500">
              Already have an account?{" "}
              <Link to="/login" state={location.state} className="font-medium text-brand-600 hover:text-brand-700">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
