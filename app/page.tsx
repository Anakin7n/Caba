"use client";

import { ConversationProvider, useConversation } from "@/hooks/useConversation";
import { IceBreaker } from "@/components/IceBreaker";
import { SwipeDeck } from "@/components/SwipeDeck";
import { Generating } from "@/components/Generating";
import { ResultReport } from "@/components/ResultReport";

function StageRouter() {
  const { stage } = useConversation();

  switch (stage) {
    case "icebreaker":
      return <IceBreaker />;
    case "swiping":
      return <SwipeDeck />;
    case "generating":
      return <Generating />;
    case "result":
      return <ResultReport />;
    default:
      return <IceBreaker />;
  }
}

export default function Home() {
  return (
    <ConversationProvider>
      <StageRouter />
    </ConversationProvider>
  );
}
