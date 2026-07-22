import { describe, expect, it } from "vitest";
import { validateTeamForm } from "@/src/features/teams/validation";

function formData(fields: Record<string, string | string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) value.forEach((entry) => data.append(key, entry));
    else data.set(key, value);
  }
  return data;
}

const memberId = "3b3da9a3-3931-4e74-a122-c3c006552e30";
const otherMemberId = "5a41c6d0-2c4e-4a9a-9e3e-1a2b3c4d5e6f";

describe("validateTeamForm", () => {
  it("accepts a minimally valid submission", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "active" }));
    expect(result.error).toBeUndefined();
    expect(result.data?.name).toBe("Field Operations");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = validateTeamForm(formData({ name: "F", status: "active" }));
    expect(result.error?.fieldErrors?.name).toBeDefined();
  });

  it("rejects an invalid status", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "deleted" }));
    expect(result.error?.fieldErrors?.status).toBeDefined();
  });

  it("rejects a color that isn't a six-digit hex", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "active", color: "green" }));
    expect(result.error?.fieldErrors?.color).toBeDefined();
  });

  it("accepts a valid six-digit hex color", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "active", color: "#22C55E" }));
    expect(result.error?.fieldErrors?.color).toBeUndefined();
  });

  it("rejects duplicate member ids", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "active", memberIds: [memberId, memberId] }));
    expect(result.error?.fieldErrors?.memberIds).toBeDefined();
  });

  it("accepts distinct valid member ids", () => {
    const result = validateTeamForm(formData({ name: "Field Operations", status: "active", memberIds: [memberId, otherMemberId] }));
    expect(result.error).toBeUndefined();
    expect(result.data?.memberIds).toEqual([memberId, otherMemberId]);
  });
});
