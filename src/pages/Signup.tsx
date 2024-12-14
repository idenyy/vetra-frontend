import { useAuth } from '../store/useAuth.store.ts';
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  EyeOff,
  Eye,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern.tsx';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { signup, verifySignup, isSigningUp, isVerifyingSignup } = useAuth();
  const navigate = useNavigate();

  const validateSignup = () => {
    if (!formData.name.trim()) return toast.error('Name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(formData.email)
    )
      return toast.error('Invalid email address');
    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6)
      return toast.error('Password must be at least 6 characters');
    return true;
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateSignup()) return;

    await signup(formData);
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== '') return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = verificationCode.join('');

    try {
      if (code.length !== 6) return toast.error('Please enter all 6 digits');

      await verifySignup(code);
      toast.success('Registration successfully confirmed');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {!isVerifyingSignup ? (
            <>
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                  <p className="text-base-content/60">
                    Get started with your free account
                  </p>
                </div>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input input-bordered w-full pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
              <div className="text-center">
                <p className="text-base-content/60">
                  Already have an account?{' '}
                  <Link to="/login" className="link link-primary pl-2">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Link to="/">
                      <MessageSquare className="size-6 text-primary cursor-default" />
                    </Link>
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Confirm Your Account</h1>
                  <p className="text-base-content/60">Enter the 6-digit verification code sent to your email</p>
                </div>
              </div>

              <form onSubmit={handleConfirmSubmit} className="space-y-6">
                <div className="grid grid-cols-6 gap-2">
                  {verificationCode.map((code, index) => (
                    <div key={index} className="form-control">
                      <input
                        type="text"
                        maxLength={1}
                        className="input input-bordered text-center h-14"
                        placeholder=""
                        value={code}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleVerificationChange(index, e.target.value)}
                        onKeyDown={(e) => handleVerificationKeyDown(e, index)}
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isVerifyingSignup}>
                  {isVerifyingSignup ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-base-content/60">
                  Didn't receive a code?{' '}
                  <Link to="/resend-code" className="link link-primary">
                    Resend Code
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <AuthImagePattern
        title="Join out community"
        description="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default Signup;
