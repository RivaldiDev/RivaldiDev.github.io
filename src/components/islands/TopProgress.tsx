import { ScrollProgressProvider, ScrollProgress } from "@animate-ui/react/primitives/scroll-progress";

export default function TopProgress() {
  return (
    <ScrollProgressProvider global transition={{ stiffness: 250, damping: 40 }}>
      <ScrollProgress mode="scaleX" className="top-progress" aria-hidden="true" />
    </ScrollProgressProvider>
  );
}
