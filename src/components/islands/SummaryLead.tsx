import cv from "@/data/cv.json";

export default function SummaryLead() {
  return <p className="cv-lead">{cv.summary}</p>;
}
