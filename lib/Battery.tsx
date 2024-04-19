// import type { StandardFootprint } from "@tscircuit/react-fiber"
import type { ReactElement } from "react"
import { PinRow } from "@tscircuit/footprints"
import type { CommonLayout, Dimension } from "@tscircuit/react-fiber"

interface Props extends CommonLayout {
  name: string
  voltage: Dimension
}

// A battery symbol is alternating long and short lines
// - short vertical top line
// - long horizontal line
// - short horizontal line
// - long horizontal line
// - short horizontal line
// - short vertical bottom line
// - plus symbol
const BATTERY_SYMBOL_LINES: Array<{
  x1: number
  y1: number
  x2: number
  y2: number
}> = [
  {
    x1: 0,
    y1: -0.3,
    x2: 0,
    y2: -0.7,
  },
  {
    x1: -0.5,
    y1: -0.3,
    x2: 0.5,
    y2: -0.3,
  },
  {
    x1: -0.25,
    y1: -0.1,
    x2: 0.25,
    y2: -0.1,
  },
  {
    x1: -0.5,
    y1: 0.1,
    x2: 0.5,
    y2: 0.1,
  },
  {
    x1: -0.25,
    y1: 0.3,
    x2: 0.25,
    y2: 0.3,
  },
  {
    x1: 0,
    y1: 0.3,
    x2: 0,
    y2: 0.7,
  },
  // plus symbol
  {
    x1: 0.3,
    y1: -0.62,
    x2: 0.3,
    y2: -0.48,
  },
  {
    x1: 0.3 - 0.14 / 2,
    y1: -0.55,
    x2: 0.3 + 0.14 / 2,
    y2: -0.55,
  },
  // minus symbol
  {
    x1: 0.3 - 0.14 / 2,
    y1: 0.55,
    x2: 0.3 + 0.14 / 2,
    y2: 0.55,
  },
]

export const Battery = ({ name, footprint, voltage, ...props }: Props) => (
  <component
    name={name}
    footprint={footprint ?? <PinRow pad_count={2} pad_pitch="0.2in" />}
    {...(props as any)}
  >
    {BATTERY_SYMBOL_LINES.map((line, i) => (
      <schematicline {...line} />
    ))}
    <port x={0} y={-0.7} name="plus" pin_number={1} direction="up" />
    <port x={0} y={0.7} name="minus" pin_number={2} direction="down" />
  </component>
)
