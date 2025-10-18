import React from 'react'
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api.js';

const SignupPage = () => {
  const [signUpData, setSignupData] = React.useState({
    fullname: '',
    email: '',
    password: ''
  });

  const queryClient = useQueryClient();

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"]}),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signUpData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* Signup - form leftside */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='w-9 h-9 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              LingGo
            </span>
          </div>

          {/* Error message if any */}
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={ handleSignup }>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join LingGo and start your language learning journey</p>
                </div>
                {/* FullName */}
                <div className='space-y-3'>
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input type="text" placeholder='Jashwanth Yerra' className='input input-bordered w-full' value={signUpData.fullname}
                      onChange={(e) => setSignupData({...signUpData, fullname: e.target.value})} required />
                  </div>
                  {/* Email */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input type="email" placeholder='hello@example.com' className='input input-bordered w-full' value={signUpData.email}
                      onChange={(e) => setSignupData({...signUpData, email: e.target.value})} required />
                  </div>
                  {/* Password */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input type="password" placeholder='Your Password' className='input input-bordered w-full' value={signUpData.password}
                      onChange={(e) => setSignupData({...signUpData, password: e.target.value})} required />
                  </div>
                  <p className='text-sm opacity-70 mt-1'>Password must be at least 6 characters long</p>

                  <div className='form-control w-full'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" className='checkbox checkbox-sm' required/>
                      <span className='text-xs leading-tight'>
                        I agree to the{' '}
                        <span className='text-primary hover:underline'>terms of service</span> and{' '}
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className='text-center mt-2'>
                  <p className='text-sm'>
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">Sign-in</Link>
                  </p>
                </div>

              </div>
            </form>
          </div>
        </div>

        {/* Signup - rightside */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            {/* Illustration */}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src="/Video-call.png" alt="language connection illustration" className='w-full h-full'/>
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
              <p className='opacity-70'> Practice converstions, make friends, and improve your language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage