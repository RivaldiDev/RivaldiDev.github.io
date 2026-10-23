import type { ReactNode } from "react";
import { Tilt, TiltContent } from "@animate-ui/react/primitives/effects/tilt";
import { Shine } from "@animate-ui/react/primitives/effects/shine";

// 3D tilt that follows the pointer plus a light sweep on hover, around a preview frame.
export default function PreviewFrame({ bar, children }: { bar: string; children: ReactNode }) {
  return (
    <Tilt maxTilt={7} perspective={900} transition={{ stiffness: 220, damping: 24 }}>
      <TiltContent>
        <Shine enableOnHover color="#eae8e1" opacity={0.08} deg={115} duration={1.1} className="cv-shot__frame">
          <div className="cv-shot__bar"><i></i><i></i><i></i><span>{bar}</span></div>
          {children}
        </Shine>
      </TiltContent>
    </Tilt>
  );
}
