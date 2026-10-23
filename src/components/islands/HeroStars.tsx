import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

// Subtle warm star field behind the hero. Pointer parallax on, no background of its own.
export default function HeroStars() {
  return (
    <StarsBackground
      className="hero-stars absolute inset-0 -z-10 bg-none"
      starColor="#d9a441"
      factor={0.04}
      speed={70}
      pointerEvents={false}
      aria-hidden="true"
    />
  );
}
