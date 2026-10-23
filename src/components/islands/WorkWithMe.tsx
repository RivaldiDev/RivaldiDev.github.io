import { LiquidButton } from "@/components/animate-ui/buttons/liquid";

export default function WorkWithMe() {
  return (
    <LiquidButton asChild hoverScale={1.03} fillHeight="4px" className="aui-liquid">
      <a href="mailto:ripaldialdo001@gmail.com?subject=Project%20inquiry">Work with me</a>
    </LiquidButton>
  );
}
