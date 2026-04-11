export type EmergencyAlertType = "call" | "whatsapp_location";

export interface EmergencyFormData {
  blood_type: string;
  allergies: string;
  medications: string;
  address: string;
  alert_type: EmergencyAlertType;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  notes: string;
}

export const DEFAULT_EMERGENCY_FORM_DATA: EmergencyFormData = {
  blood_type: "",
  allergies: "",
  medications: "",
  address: "",
  alert_type: "call",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  notes: "",
};
