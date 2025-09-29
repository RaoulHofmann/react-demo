import type {FormData, Location} from "../types/form.ts";
import {useFormContext, type Validate} from "react-hook-form";

interface Props {
  data: Location | null;
  fieldName: "source" | "destination";
  validate?: Validate<string | number, FormData>;
  disabledValue?: string;
}

export default function CountryDropdown({data, fieldName, validate, disabledValue}: Props) {
  const { register, formState: { errors } } = useFormContext<FormData>();

  if (!data) return null;

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: '1rem'}}>
      <label htmlFor={fieldName}>{fieldName?.toUpperCase()}: </label>
      <select {...register(fieldName, {required: "This field is required", validate})} id={fieldName}>
        <option value="">-- Select --</option>
        {data.locations?.map((item) => (
          <option key={item?.toLowerCase()} value={item} disabled={item === disabledValue}>
            {item}
          </option>
        ))}
      </select>
      <span className={`error ${errors[fieldName] ? "visible" : ""}`}>
        {errors[fieldName]?.message?.toString() || ""}
      </span>
    </div>
  );
}
