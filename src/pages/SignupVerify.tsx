import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/useAuth.store.ts';
import toast from 'react-hot-toast';

const ConfirmationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== '') return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const { verifySignup, isVerifyingSignup } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = verificationCode.join('');
    console.log('Entered Code:', code);

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
          {/* Заголовок */}
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

          {/* Форма вводу */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                </div>
              ))}
            </div>

            {/* Кнопка підтвердження */}
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

          {/* Посилання для повторної відправки коду */}
          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Didn't receive a code?{' '}
              <Link to="/resend-code" className="link link-primary">
                Resend Code
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Стилізована секція */}
      <div className="hidden lg:block bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/800x600')" }}>
        <div className="h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-bold">Join our community</h1>
          <p className="text-base mt-2">Connect with friends, share moments, and stay in touch with your loved ones.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
