"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

export default function TooltipExample() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Hover me
          </button>
        </Tooltip.Trigger>

        <Tooltip.Content
          side="top"
          align="center"
          sideOffset={8}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          This is a tooltip
          <button>
            sub
          </button>
          <Tooltip.Arrow style={{ fill: "black" }} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
