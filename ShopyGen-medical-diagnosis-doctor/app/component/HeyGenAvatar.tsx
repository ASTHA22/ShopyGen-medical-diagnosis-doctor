import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Button, Card, CardBody, Divider, Spinner } from "@nextui-org/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";
import {
  processConversationForCart,
  ConversationMessage,
  updateCart,
} from "../utils/cartUtils";
import { MenuItem } from "../types";
import { Content, Roboto } from "next/font/google";

interface HeyGenAvatarProps {
  onTranscriptUpdate?: (
    transcripts: Array<{ role: string; content: string }>
  ) => void;
  knowledgeId?: string;
  avatarName?: string;
  voiceId?: string;
  voiceRate?: number;
  voiceEmotion?: VoiceEmotion;
  quality?: AvatarQuality;
  onCartUpdate?: (updates: MenuItem[]) => void;
  menuItems?: MenuItem[];
  currentCart?: MenuItem[];
}

type ConversationRole = "system" | "user" | "assistant";

const PlayIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    {...props}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    {...props}
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export default function HeyGenAvatar({
  onTranscriptUpdate,
  knowledgeId = "25c1f2a1a1eb449f8bb06a5dab76dc0f",
  avatarName = "nik_expressive_20240910",
  voiceId = "1ae3be1e24894ccabdb4d8139399f721",
  voiceRate = 1.5,
  voiceEmotion = VoiceEmotion.EXCITED,
  quality = AvatarQuality.Low,
  onCartUpdate,
  menuItems = [],
  currentCart = [],
}: HeyGenAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<StartAvatarResponse>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [chatMode, setChatMode] = useState("voice_mode");
  const [tempMessageRef, setTempMessageRef] = useState<string>("");
  const [transcriptList, setTranscriptList] = useState<ConversationMessage[]>(
    []
  );
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  // Process transcripts for cart updates
  const processTranscripts = useCallback(
    async (newTranscriptList: ConversationMessage[]) => {
      if (newTranscriptList.length > 0) {
        // Convert transcriptList to conversation format
        // const newConversationHistory = transcriptList.map(item => ({
        //   role: item.user === "assistant" ? "assistant" : "user",
        //   content: item.message
        // }));

        // setConversationHistory(newConversationHistory);

        try {
          // Process cart updates
          const cartUpdates = await processConversationForCart(
            transcriptList,
            menuItems
          );

          if (cartUpdates.length > 0 && onCartUpdate) {
            // Apply each update sequentially to the current cart
            let updatedCart = [...currentCart];
            cartUpdates.forEach((update) => {
              updatedCart = updateCart(updatedCart, update);
            });
            onCartUpdate(updatedCart);
          }
        } catch (error) {
          console.error("Error processing cart updates:", error);
        }
      }
    },
    [menuItems, currentCart, onCartUpdate, transcriptList]
  );

  const handleAvatarTalkingMessage = useCallback((event: any) => {
    setTempMessageRef((prev) => prev + event.detail.message);
  }, []);

  const handleAvatarStartTalking = useCallback(
    async (event: any) => {
      const newTranscriptList: ConversationMessage[] = [
        ...transcriptList,
        { role: "assistant", content: tempMessageRef },
      ];
      setTranscriptList(newTranscriptList);
      onTranscriptUpdate?.(newTranscriptList);
      setTempMessageRef("");
      await processTranscripts(newTranscriptList);
    },
    [tempMessageRef, transcriptList, onTranscriptUpdate]
  );

  const handleUserTalkingMessage = useCallback(
    async (event: any) => {
      const newTranscriptList: ConversationMessage[] = [
        ...transcriptList,
        { role: "user", content: event.detail.message },
      ];
      setTranscriptList(newTranscriptList);
      onTranscriptUpdate?.(newTranscriptList);
      await processTranscripts(newTranscriptList);
    },
    [transcriptList, onTranscriptUpdate]
  );

  const handleStreamReady = useCallback((event: any) => {
    setStream(event.detail);
  }, []);

  const handleStreamDisconnected = useCallback(() => {
    endSession();
  }, []);

  useEffect(() => {
    if (!avatar.current) return;

    avatar.current.on(
      StreamingEvents.AVATAR_TALKING_MESSAGE,
      handleAvatarTalkingMessage
    );
    avatar.current.on(
      StreamingEvents.AVATAR_START_TALKING,
      handleAvatarStartTalking
    );
    avatar.current.on(
      StreamingEvents.USER_TALKING_MESSAGE,
      handleUserTalkingMessage
    );
    avatar.current.on(StreamingEvents.STREAM_READY, handleStreamReady);
    avatar.current.on(
      StreamingEvents.STREAM_DISCONNECTED,
      handleStreamDisconnected
    );

    return () => {
      if (!avatar.current) return;
      avatar.current.off(
        StreamingEvents.AVATAR_TALKING_MESSAGE,
        handleAvatarTalkingMessage
      );
      avatar.current.off(
        StreamingEvents.AVATAR_START_TALKING,
        handleAvatarStartTalking
      );
      avatar.current.off(
        StreamingEvents.USER_TALKING_MESSAGE,
        handleUserTalkingMessage
      );
      avatar.current.off(StreamingEvents.STREAM_READY, handleStreamReady);
      avatar.current.off(
        StreamingEvents.STREAM_DISCONNECTED,
        handleStreamDisconnected
      );
    };
  }, [
    avatar.current,
    handleAvatarTalkingMessage,
    handleAvatarStartTalking,
    handleUserTalkingMessage,
    handleStreamReady,
    handleStreamDisconnected,
  ]);

  const startSession = async () => {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality,
        avatarName,
        knowledgeId,
        voice: {
          voiceId,
          rate: voiceRate,
          emotion: voiceEmotion,
        },
        language: "en",
        disableIdleTimeout: true,
      });

      setData(res);
      await avatar.current?.startVoiceChat({
        useSilencePrompt: false,
      });
      setChatMode("voice_mode");
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoadingSession(false);
    }
  };

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      setDebug(
        `Error fetching token: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
    return "";
  }

  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current.interrupt().catch((e) => {
      setDebug(e.message);
    });
  }

  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div className="w-full h-full ">
        {stream && (
          <div className="w-full h-full">
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {isLoadingSession && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Spinner size="lg" color="white" />
              </div>
            )}
          </div>
        )}
      </div>
      {!isLoadingSession && !stream ? (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            isIconOnly
            className="bg-[#00FF77]/80 hover:bg-green text-white w-12 h-12 flex items-center justify-center rounded-full"
            size="lg"
            variant="shadow"
            onClick={startSession}
          >
            <PlayIcon className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            isIconOnly
            className="bg-red/80  text-white w-12 h-12 flex items-center justify-center rounded-full"
            size="lg"
            variant="shadow"
            onClick={endSession}
          >
            <div className="relative">
              <PauseIcon className="w-6 h-6" />
              {isLoadingSession && (
                <Spinner
                  size="sm"
                  color="white"
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>
          </Button>
          {/* {debug && <div>{debug}</div>} */}
        </div>
      )}
    </div>
  );
}
