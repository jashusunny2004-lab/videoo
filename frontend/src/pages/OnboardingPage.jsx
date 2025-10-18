import { useMutation, useQueryClient } from '@tanstack/react-query';
import  useAuthUser  from '../hooks/useAuthUser.js';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import React from 'react';
import { ShuffleIcon, MapPinIcon, ShipWheelIcon, LoaderIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';



const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setformState] = React.useState({
    fullname: authUser?.fullname || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilepic: authUser?.profilepic || '',
  });

  const { mutate: onboardingMutation , isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to complete onboarding");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${randomIndex}.png`;
    
    setformState({...formState, profilepic: randomAvatar })
    toast.success("Random changed successfully");
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='bg-base-200 p-6 shadow-xl w-full max-w-3xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete your profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profile pic container */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/* Image preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilepic ? (
                  <img src={formState.profilepic} alt="Profile preview" className='w-full h-full object-cover'/>
                ) : (
                  <div className='flex items-center justify-center w-full h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>
              {/* Generate Random Avatar */}
              <div className='flex items-center gap-2'>
                <button type='button' onClick={ handleRandomAvatar } className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FullName */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input 
                  type="text" 
                  name='fullname'
                  value={formState.fullname}
                  onChange={(e) => setformState({...formState, fullname: e.target.value})}
                  className='input input-bordered w-full'
                  placeholder='Enter your full name'
                />
              </div>

              {/* Bio */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Bio</span>
                </label>
                <textarea 
                  name='bio'
                  value={formState.bio}
                  onChange={(e) => setformState({...formState, bio: e.target.value})}
                  className='textarea textarea-bordered h-24'
                  placeholder='Tell others about yourself and your language learning goals'
                />
              </div>

              {/* Languages */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Native Language */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Native Language</span>
                  </label>
                  <select name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setformState({...formState, nativeLanguage: e.target.value})}
                    className='select select-bordered w-full'
                  >
                    <option value="">Select Your Native language</option>
                    { LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Learning Language */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Learning Language</span>
                  </label>
                  <select 
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) => setformState({...formState, learningLanguage: e.target.value})}
                    className='select select-bordered w-full'
                  >
                    <option value="">Select your Learning Language</option>
                    { LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Location</span>
                </label>
                <div className='relative'>
                  <MapPinIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content opacity-70' />
                  <input 
                    type="text" 
                    name='location'
                    value={formState.location}
                    onChange={(e) => setformState({...formState, location: e.target.value})}
                    className='input input-bordered w-full pl-10'
                    placeholder='City, Country'
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type='submit' 
                className='btn btn-primary w-full'
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoaderIcon className='animate-spin size-5 mr-2' />
                    Onboarding...
                  </>
                ) : (
                  <>
                    <ShipWheelIcon className='size-5 mr-2' />
                    Complete Onboarding
                  </>
                )}
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage