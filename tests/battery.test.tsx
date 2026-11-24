import { expect, test, spyOn, afterEach } from "bun:test"
import { Battery } from "../lib/Battery"
import { createProjectBuilder, createRoot } from "tscircuit"

const renderBattery = async () => {
  const pb = createProjectBuilder()
  const result = await createRoot().render(
    <Battery name="B1" voltage="5v" />,
    pb as any,
  )
  return result as any[]
}

afterEach(() => {
  ;(console.error as any).mockRestore?.()
})

test("renders without React key warnings from the Battery itself", async () => {
  const errorSpy = spyOn(console, "error").mockImplementation(() => {})

  await renderBattery()

  // The default PinRow footprint from @tscircuit/footprints emits its own
  // upstream key warning; this test only fails for warnings caused by the
  // Battery component's own schematicline list.
  const batteryKeyWarnings = errorSpy.mock.calls.filter(
    (args) =>
      args.some(
        (arg) =>
          typeof arg === "string" && arg.includes("unique \"key\" prop"),
      ) &&
      args.some((arg) => typeof arg === "string" && arg.includes("Battery")),
  )
  expect(batteryKeyWarnings).toHaveLength(0)
})

test("renders the full battery symbol geometry", async () => {
  spyOn(console, "error").mockImplementation(() => {})

  const result = await renderBattery()
  const lines = result.filter((e) => e.type === "schematic_line")

  // 6 symbol lines plus 2 plus-sign ticks plus 1 minus-sign tick
  expect(lines).toHaveLength(9)

  const hasLine = (x1: number, y1: number, x2: number, y2: number) =>
    lines.some(
      (l) =>
        Math.abs(l.x1 - x1) < 1e-9 &&
        Math.abs(l.y1 - y1) < 1e-9 &&
        Math.abs(l.x2 - x2) < 1e-9 &&
        Math.abs(l.y2 - y2) < 1e-9,
    )

  // terminal stubs connect to the outer plates
  expect(hasLine(0, -0.3, 0, -0.7)).toBe(true)
  expect(hasLine(0, 0.3, 0, 0.7)).toBe(true)
  // positive terminal plate is the long line at the top
  expect(hasLine(-0.5, -0.3, 0.5, -0.3)).toBe(true)
  // negative terminal plate is the short line at the bottom
  expect(hasLine(-0.25, 0.3, 0.25, 0.3)).toBe(true)

  const sourcePorts = result.filter((e) => e.type === "source_port")
  const plus = sourcePorts.find((p) => p.name === "plus")
  const minus = sourcePorts.find((p) => p.name === "minus")
  expect(plus?.pin_number).toBe(1)
  expect(minus?.pin_number).toBe(2)

  const schematicPorts = result.filter((e) => e.type === "schematic_port")
  expect(schematicPorts).toHaveLength(2)
})
