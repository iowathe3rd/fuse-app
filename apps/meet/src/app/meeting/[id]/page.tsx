"use client";

import Alert from "@/components/Alert";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useCallById } from "@/hooks/useCallById";
import StreamVideoProvider from "@/providers/StramClientProvider";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { useState } from "react";

const Meeting: React.FC<{ params: { id: string } }> = ({ params: { id } }) => {
  const { user, isLoaded } = useUser();
  const [isSetupCompleteState, setIsSetupCompleteState] =
    useState<boolean>(false);

  const { call, isCallLoading } = useCallById(id);
  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamVideoProvider>
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupCompleteState ? (
              <MeetingSetup setIsSetupComplete={setIsSetupCompleteState} />
            ) : (
              <MeetingRoom />
            )}
          </StreamTheme>
        </StreamCall>
      </StreamVideoProvider>
    </main>
  );
};

export default Meeting;
