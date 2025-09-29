export interface Location {
  locations: string[];
}

export interface FormData {
  source: string;
  destination: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  unit: 'centimetres' | 'millimetres';
}

export interface ApiResponse extends FormData{
  consignmentId?: string;
}