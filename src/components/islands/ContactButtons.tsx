import { FlipButton, FlipButtonFront, FlipButtonBack } from "@/components/animate-ui/buttons/flip";

const Btn = ({ href, front, back, dim = false }: { href: string; front: string; back: string; dim?: boolean }) => (
  <FlipButton asChild from="top" className={dim ? "aui-flip aui-flip--dim" : "aui-flip"}>
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
      <FlipButtonFront className="aui-flip__face">{front}</FlipButtonFront>
      <FlipButtonBack className="aui-flip__face aui-flip__face--back">{back}</FlipButtonBack>
    </a>
  </FlipButton>
);

export default function ContactButtons() {
  return (
    <div className="hero__cta">
      <Btn href="mailto:ripaldialdo001@gmail.com" front="ripaldialdo001@gmail.com" back="Email me" />
      <Btn href="https://github.com/RivaldiDev" front="github.com/RivaldiDev" back="See the code" dim />
    </div>
  );
}
