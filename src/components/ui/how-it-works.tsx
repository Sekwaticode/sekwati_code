"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

type ColorTheme = "orange" | "blue" | "purple";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: ColorTheme;
  className?: string;
  rotate?: string;
  style?: React.CSSProperties;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const BG_COLORS: Record<ColorTheme, string> = {
  orange: "bg-orange-50",
  blue: "bg-blue-50",
  purple: "bg-purple-50",
};
const TEXT_COLORS: Record<ColorTheme, string> = {
  orange: "text-orange-500",
  blue: "text-blue-600",
  purple: "text-purple-600",
};
const BORDER_COLORS: Record<ColorTheme, string> = {
  orange: "border-orange-100",
  blue: "border-blue-100",
  purple: "border-purple-100",
};

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className = "",
  rotate = "",
  style,
  colors: customColors,
}: CardProps) => {
  const bgColor = customColors?.bg || BG_COLORS[colorTheme];
  const textColor = customColors?.text || TEXT_COLORS[colorTheme];
  const borderColor = customColors?.border || BORDER_COLORS[colorTheme];

  return (
    <div
      className={`relative w-full max-w-md mx-auto lg:mx-0 lg:w-[280px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
      style={style}
    >
      <div className="bg-white p-2 rounded-[25px] shadow-[0px_10px_20px_0px_#D3D3D3] border border-neutral-100">
        <Pin className={`w-8 h-8 ${textColor} z-20 mb-6 mx-auto`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-[15px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-4xl mb-5`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-800 leading-tight mb-[10px]">
            {title}
          </h3>
          <p className="text-neutral-500 text-sm/5 tracking-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: ColorTheme;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
  style?: React.CSSProperties;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  /** Custom card positions. If set, the connecting line is hidden because it can't follow arbitrary positions. */
  stepPositions?: StepPosition[];
}

// Layout geometry for the large-screen (lg+) zig-zag. Units are px inside a 1000px-wide canvas.
const ROW_GAP = 420; // vertical distance between rows (one left + one right card)
const RIGHT_OFFSET = 120; // right-hand cards sit a little lower than left-hand ones
const CARD_HEIGHT = 400; // rough card height incl. rotation, used to size the canvas
const LEFT_X = 290; // centre of a left card (left: 15%, width 280)
const RIGHT_X = 710; // centre of a right card (right: 15%, width 280)
const PATH_Y = 150; // where the line meets each card, measured from its top

const cardTop = (index: number) =>
  Math.floor(index / 2) * ROW_GAP + (index % 2 ? RIGHT_OFFSET : 0);

const defaultPosition = (index: number): StepPosition => {
  const isLeft = index % 2 === 0;
  return {
    className: `lg:absolute lg:top-[var(--card-top)] ${
      isLeft ? "lg:left-[15%]" : "lg:right-[15%]"
    }`,
    rotate: isLeft ? "rotate-[8deg]" : "-rotate-[8deg]",
    style: { "--card-top": `${cardTop(index)}px` } as React.CSSProperties,
  };
};

// Builds a dashed S-curve that runs through every card, alternating left/right.
const buildPath = (count: number) => {
  const points = Array.from({ length: count }, (_, i) => ({
    x: i % 2 === 0 ? LEFT_X : RIGHT_X,
    y: cardTop(i) + PATH_Y,
  }));
  return points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${midY + 60}, ${p.x} ${midY - 60}, ${p.x} ${p.y}`;
  }, "");
};

const DEFAULT_FEATURES: Step[] = [
  {
    title: "Create Account",
    description:
      "Sign up in minutes. Enter your details and verify your email to get started.",
    colorTheme: "orange",
  },
  {
    title: "Verify Identity",
    description:
      "Complete your profile verification to ensure secure transactions and compliance.",
    colorTheme: "blue",
  },
  {
    title: "Select Plan",
    description:
      "Choose from a variety of plans tailored to your goals.",
    colorTheme: "purple",
  },
];

export default function HowItWorks({
  features,
  className = "",
  stepPositions,
}: HowItWorksProps) {
  const data = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const height = cardTop(data.length - 1) + CARD_HEIGHT;
  const showPath = data.length > 1 && !stepPositions;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`bg-white max-lg:pt-10 max-lg:pb-[100px] lg:py-20 px-8 relative overflow-hidden ${className}`}
      >
        {/* Notebook-paper lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 lg:space-y-0 lg:block h-auto lg:h-[var(--lg-height)]"
            style={{ "--lg-height": `${height}px` } as React.CSSProperties}
          >
            {showPath && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                <m.path
                  d={buildPath(data.length)}
                  stroke="currentColor"
                  className="text-neutral-300"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -140 }} // multiple of 14 (8+6) for a seamless loop
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            )}

            {data.map((step, index) => {
              const position = stepPositions
                ? stepPositions[index % stepPositions.length]
                : defaultPosition(index);

              return (
                <Card
                  key={step.title}
                  number={String(index + 1).padStart(2, "0")}
                  title={step.title}
                  description={step.description}
                  colorTheme={step.colorTheme || "blue"}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                  style={position.style}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
