// types.ts

export interface Avatar {
    name: string;
    Shopygen_faceid: string;
    elevenlabs_voiceid: string;
    initialPrompt: string;
    imageUrl: string;
  }
  
  // You can add more types here as needed for your application
  
  export interface AvatarInteractionProps {
    Shopygen_faceid: string;
    elevenlabs_voiceid: string;
    initialPrompt: string;
    audioStream: MediaStream | null;
  }
  