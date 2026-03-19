export interface Device {
  device_id: string;
  place_id: string;
  name: string;
  status: 'online' | 'offline';
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  sensors: Sensor[];
  actuators: Actuator[];
}

export interface DeviceSummary {
  device_id: string;
  place_id: string;
  name: string;
  status: 'online' | 'offline';
  last_seen_at: string | null;
}

export interface Sensor {
  sensor_id: string;
  device_id: string;
  key: string;
  name: string;
  value_type: 'number' | 'boolean';
  unit_label: string;
  precision: number;
}

export interface Actuator {
  actuator_id: string;
  device_id: string;
  key: string;
  name: string;
  value_type: 'number' | 'boolean' | 'enum';
  unit_label: string;
  precision: number;
  min_value: number | null;
  max_value: number | null;
  step: number | null;
  enum_options: string[];
}

export interface Threshold {
  threshold_id: string;
  sensor_id: string;
  type: 'min' | 'max';
  value: number;
  severity: 'warning' | 'critical';
}

export interface CreateDeviceRequest {
  name: string;
}

export interface CreateDeviceResponse {
  device_id: string;
  token: string;
}

export interface CreateSensorRequest {
  key: string;
  name: string;
  value_type: 'number' | 'boolean';
  unit_label: string;
  precision: number;
}

export interface CreateActuatorRequest {
  key: string;
  name: string;
  value_type: 'number' | 'boolean' | 'enum';
  unit_label: string;
  precision: number;
  min_value?: number;
  max_value?: number;
  step?: number;
  enum_options?: string[];
}

export interface SetThresholdRequest {
  type: 'min' | 'max';
  value: number;
  severity: 'warning' | 'critical';
}

export interface SendCommandRequest {
  actuator_key: string;
  value: string;
}

export interface MqttCredentials {
  username: string;
  password: string;
  expires_at: number;
}
