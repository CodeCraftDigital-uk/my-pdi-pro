// ─── Remote Capture Tool – Type Definitions ───────────────────────────

export const CAPTURE_STEPS = [
  { key: 'exterior', label: 'Exterior Photos', description: 'Front, rear, left and right side views' },
  { key: 'damage', label: 'Damage Close-ups', description: 'Close-up photos of any visible damage' },
  { key: 'interior', label: 'Interior Photos', description: 'Driver seat, passenger seat, rear seats, dashboard, centre console' },
  { key: 'dashboard', label: 'Dashboard (Ignition On)', description: 'Odometer, warning lights with ignition on' },
  { key: 'vin', label: 'VIN Plate', description: 'Vehicle Identification Number plate' },
  { key: 'tyres', label: 'Tyre Tread Photos', description: 'Close-up of each tyre tread' },
  { key: 'service_history', label: 'Service History', description: 'Service book or digital service records' },
  { key: 'walkaround', label: 'Walkaround Video', description: '30–60 second walkaround video' },
] as const;

export type CaptureStepKey = (typeof CAPTURE_STEPS)[number]['key'];

export type CaptureStatus = 'pending' | 'in_progress' | 'completed' | 'expired' | 'archived';

export interface RequiredSteps {
  exterior: boolean;
  damage: boolean;
  interior: boolean;
  dashboard: boolean;
  vin: boolean;
  tyres: boolean;
  service_history: boolean;
  walkaround: boolean;
}

export const defaultRequiredSteps: RequiredSteps = {
  exterior: true,
  damage: true,
  interior: true,
  dashboard: true,
  vin: true,
  tyres: false,
  service_history: false,
  walkaround: false,
};

export interface CaptureRequest {
  id: string;
  token: string;
  dealer_name: string | null;
  dealer_email: string | null;
  seller_name: string;
  seller_email: string | null;
  seller_phone: string | null;
  vehicle_registration: string | null;
  vehicle_vin: string | null;
  internal_notes: string | null;
  expires_at: string;
  required_steps: RequiredSteps;
  status: CaptureStatus;
  created_at: string;
}

export interface CaptureSubmission {
  id: string;
  capture_request_id: string;
  declaration_name: string | null;
  declaration_confirmed: boolean;
  submitted_at: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  no_damage_confirmed: boolean;
}

export interface CaptureMedia {
  id: string;
  capture_request_id: string;
  submission_id: string | null;
  step: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface CaptureNote {
  id: string;
  capture_request_id: string;
  note_text: string;
  created_at: string;
}

export interface CreateCaptureRequestInput {
  seller_name: string;
  seller_email?: string;
  seller_phone?: string;
  vehicle_registration?: string;
  vehicle_vin?: string;
  internal_notes?: string;
  dealer_name?: string;
  dealer_email?: string;
  expires_at: string;
  required_steps: RequiredSteps;
}

// Exterior sub-steps
export const EXTERIOR_ANGLES = [
  { key: 'exterior_front', label: 'Front' },
  { key: 'exterior_rear', label: 'Rear' },
  { key: 'exterior_left', label: 'Left Side' },
  { key: 'exterior_right', label: 'Right Side' },
] as const;

export const INTERIOR_AREAS = [
  { key: 'interior_driver', label: 'Driver Seat' },
  { key: 'interior_passenger', label: 'Passenger Seat' },
  { key: 'interior_rear', label: 'Rear Seats' },
  { key: 'interior_dashboard', label: 'Dashboard' },
  { key: 'interior_console', label: 'Centre Console' },
] as const;

export const TYRE_POSITIONS = [
  { key: 'tyre_front_left', label: 'Front Left' },
  { key: 'tyre_front_right', label: 'Front Right' },
  { key: 'tyre_rear_left', label: 'Rear Left' },
  { key: 'tyre_rear_right', label: 'Rear Right' },
] as const;

export const DASHBOARD_CAPTURES = [
  { key: 'dashboard_odometer', label: 'Odometer' },
  { key: 'dashboard_warnings', label: 'Warning Lights' },
] as const;
