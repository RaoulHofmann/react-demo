import {useEffect, useState} from 'react'
import './index.css'
import {FormProvider, type SubmitHandler, useForm} from "react-hook-form";
import type {FormData, Location} from "./types/form.ts";
import CountryDropdown from "./components/CountryDropdown.tsx";
import BasicInput from "./components/BasicInput.tsx";

function App() {
  const [data, setData] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const methods = useForm<FormData>({
    mode: 'onChange'
  });

  useEffect(() => {
    fetch('/api/location')
      .then((resp) => resp.json())
      .then(setData)
      .catch((err: Error) => setError(err?.message))
      .finally(() => setIsLoading(false));
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {isValid}
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/submit-consignment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || 'Submission failed');
      }
      setSuccess('Consignment submitted successfully!');
      reset();
    } catch (err: unknown) {
      console.log(err)
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Submission failed');
      }
    }
  };

  const source = watch("source");
  const destination = watch("destination");

  const unit = watch("unit");

  useEffect(() => {
    if (!unit) return;

    const [w, h, d] = watch(["width", "height", "depth"]);

    if (unit === "millimetres") {
      setValue("width", (w ?? 0) * 100);
      setValue("height", (h ?? 0) * 100);
      setValue("depth", (d ?? 0) * 100);
    } else if (unit === "centimetres") {
      setValue("width", (w ?? 0) / 100);
      setValue("height", (h ?? 0) / 100);
      setValue("depth", (d ?? 0) / 100);
    }
  }, [unit]);

  return (
    <>
      <h1>Consignment Form</h1>
      <div className="card">
        {error && (
          <div className="alert">
            {error}
          </div>
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              {isLoading ? <div className="loader"></div> :
                (
                  <>
                    <div className="field">
                      <CountryDropdown
                        data={data}
                        fieldName="source"
                        validate={(value) =>
                          value !== watch("destination") || "Source and destination cannot match"
                        }
                        disabledValue={destination}
                      />
                    </div>

                    <div className="field">
                      <CountryDropdown
                        data={data}
                        fieldName="destination"
                        validate={(value) =>
                          value !== watch("source") || "Source and destination cannot match"
                        }
                        disabledValue={source}
                      />
                    </div>
                  </>
                )}
            </div>

            <div className="form-row">
              <div className="field">
                <BasicInput
                  fieldName="weight"
                  type="number"
                  min={1}
                  additionalChecks={{
                    min: {value: 1, message: "Weight must be at least 1kg"},
                    max: {value: 1000, message: "Weight cannot exceed 1000kg"},
                    valueAsNumber: true
                  }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: '1rem'}}>
                  <label htmlFor="unit">UNIT: </label>
                  <select {...register('unit')} id="unit">
                    <option value="centimetres">Centimetres</option>
                    <option value="millimetres">Millimetres</option>
                  </select>
                  <span className="error"></span>
                </div>
              </div>
              <div className="field">
                <BasicInput
                  fieldName="height"
                  type="number"
                  min={1}
                  additionalChecks={{
                    min: {value: 1, message: "Height must be at least 1"},
                    valueAsNumber: true
                  }}
                />
              </div>
              <div className="field">
                <BasicInput
                  fieldName="depth"
                  type="number"
                  min={1}
                  additionalChecks={{
                    min: {value: 1, message: "Depth must be at least 1"},
                    valueAsNumber: true
                  }}
                />
              </div>
              <div className="field">
                <BasicInput
                  fieldName="width"
                  type="number"
                  min={1}
                  additionalChecks={{
                    min: {value: 1, message: "Width must be at least 1"},
                    valueAsNumber: true
                  }}
                />
              </div>
            </div>
            <button disabled={!isValid} onClick={handleSubmit(onSubmit)} className="submit">Submit</button>
            {success && <div className="success">{success}</div>}
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default App