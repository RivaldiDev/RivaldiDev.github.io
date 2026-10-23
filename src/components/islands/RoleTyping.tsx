import { TypingText, TypingTextCursor } from "@animate-ui/react/primitives/texts/typing";

export default function RoleTyping() {
  return (
    <TypingText className="role-typing" text={["vibecoder", "full AI agentic", "web3 enthusiast", "onchain builder"]} loop holdDelay={1600} duration={70}>
      <TypingTextCursor className="role-typing__cursor" />
    </TypingText>
  );
}
