import { useEffect, useState } from 'react';
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import useAuthUser from '../hooks/useAuthUser.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id:callId } = useParams();
  
  const [ client, setClient ] = useState(null);
  const [ call, setCall ] = useState(null);
  const [ isConnecting, setIsConnecting ] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
      queryKey: ["streamToken"],
      queryFn: getStreamToken,
      enabled: !!authUser // This will run only when the auth user is available
  });
  
  useEffect(() => {
    const initCall = async () => {
      if(!tokenData?.token || !authUser) return;

      try {
        console.log("Intializing stream video client...");

        const user = {
          id: authUser._id.toString(),
          name: authUser.fullname,
          image: authUser.profilepic,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = await videoClient.call("default" ,callId);
        await callInstance.join({ create: true });

        console.log("Call joined successfully");
        setClient(videoClient);
        setCall(callInstance);
      }
      catch(error) {
        console.error("Error initializing call:", error);
        toast.error("Failed to join the call. Please try again later.");
      }finally{
        setIsConnecting(false);
      }
    }

    initCall();
  }, [ tokenData, authUser, callId ]);

  if(isLoading || !client || !call) return <PageLoader />;

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
      {client && call ? (
        <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
      ): (
        <div className="flex items-center justify-center h-full">
          <p>Could not intialize the call. Please try again later</p>
        </div>
      )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if(callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default CallPage