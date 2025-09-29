import type {FormData} from "../types/form.ts";
import {useFormContext, type Validate} from "react-hook-form";

interface Props {
  fieldName: "weight" | "width" | "height" | "depth";
  validate?: Validate<string | number, FormData>;
  additionalChecks?: Record<string, unknown | { value: unknown, message: string }>;
  min?: number,
  max?: number,
  type: string;
}

export default function BasicInput({fieldName, validate, type, additionalChecks, min, max}: Props) {
  const {register, formState: {errors}} = useFormContext<FormData>();

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: '1rem'}}>
      <label htmlFor={fieldName}>{fieldName?.toUpperCase()}: </label>
      <input type={type} min={min} id={fieldName}
             max={max} {...register(fieldName, {required: "This field is required", ...additionalChecks, validate})}/>
      <span className={`error ${errors[fieldName] ? "visible" : ""}`}>
        {errors[fieldName]?.message?.toString() || ""}
      </span>
    </div>
  )
}