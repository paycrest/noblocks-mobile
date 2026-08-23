export type LiquidGlassDirection = "forward" | "back";
export type LiquidGlassVariant = "entry" | "step";

let pendingDirection: LiquidGlassDirection = "forward";
let pendingVariant: LiquidGlassVariant = "step";
let pendingBackTarget: string | null = null;
let hasPendingTransition = false;

export function setLiquidGlassTransition(options: {
  direction?: LiquidGlassDirection;
  variant?: LiquidGlassVariant;
}) {
  hasPendingTransition = true;

  if (options.direction) {
    pendingDirection = options.direction;
  }

  if (options.variant) {
    pendingVariant = options.variant;
  }
}

export function prepareLiquidGlassBack(
  targetStepKey: string,
  variant: LiquidGlassVariant = "step",
) {
  hasPendingTransition = true;
  pendingDirection = "back";
  pendingVariant = variant;
  pendingBackTarget = targetStepKey;
}

export function consumeLiquidGlassTransition(): {
  direction: LiquidGlassDirection;
  variant: LiquidGlassVariant;
  shouldAnimate: boolean;
} {
  const transition = {
    direction: pendingDirection,
    variant: pendingVariant,
    shouldAnimate: hasPendingTransition,
  };

  pendingDirection = "forward";
  pendingVariant = "step";
  hasPendingTransition = false;

  return transition;
}

export function consumeLiquidGlassBackReplay(stepKey: string): boolean {
  if (pendingBackTarget !== stepKey) {
    return false;
  }

  pendingBackTarget = null;
  pendingDirection = "back";
  hasPendingTransition = true;
  return true;
}

export const LIQUID_GLASS_BACK_TARGETS: Record<
  string,
  { stepKey: string; variant: LiquidGlassVariant }
> = {
  review: { stepKey: "recipient", variant: "step" },
  recipient: { stepKey: "details", variant: "entry" },
};

export const LIQUID_GLASS_EXIT_MS = 340;
