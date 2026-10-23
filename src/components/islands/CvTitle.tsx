import { SplittingText } from "@animate-ui/react/primitives/texts/splitting";

export default function CvTitle({ text }: { text: string }) {
  return (
    <SplittingText
      className="section__title"
      text={text}
      type="chars"
      stagger={0.035}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      inView
      inViewOnce
      inViewMargin="-80px"
    />
  );
}
