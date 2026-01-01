import { render } from "@testing-library/react";
import { AssistantModal } from "./assistant-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { describe, it } from "vitest";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { FC, ReactNode } from "react";

const RuntimeWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const runtime = useLocalRuntime({
    onNew: async () => {},
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};

describe("AssistantModal", () => {
  it("renders without crashing", () => {
    render(
      <RuntimeWrapper>
        <TooltipProvider>
          <AssistantModal />
        </TooltipProvider>
      </RuntimeWrapper>
    );
  });
});