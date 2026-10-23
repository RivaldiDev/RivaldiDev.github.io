import { HighlightText } from "@animate-ui/react/primitives/texts/highlight";

const H = ({ t, d = 0 }: { t: string; d?: number }) => (
  <HighlightText className="cv-hl" text={t} delay={d} inView inViewOnce inViewMargin="-60px" />
);

export default function SummaryLead() {
  return (
    <p className="cv-lead">
      In the last two months I built and shipped <H t="seven products" /> and a toolkit of 15 launchpad repos, all on Solana and Robinhood Chain. An onchain card game, two memecoin launchpads with trading built in, a launch scanner, a tax token site, a chat trading agent and a social trading terminal. Most repos are private. The previews below come from the live sites or from the real code run on my server.
    </p>
  );
}
