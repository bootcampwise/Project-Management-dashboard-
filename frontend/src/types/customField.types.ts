export type CustomFieldType = "TEXT" | "NUMBER" | "DATE" | "SELECT";

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  options: string[];
  projectId: string;
  createdAt: string;
}

export interface CustomFieldValue {
  id: string;
  value: string;
  customFieldId: string;
  taskId: string;
  customField?: CustomField;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldPayload {
  name: string;
  type: CustomFieldType;
  options?: string[];
  projectId: string;
}

export interface SetCustomFieldValuePayload {
  fieldId: string;
  taskId: string;
  value: string;
}

export interface TaskCustomFieldsProps {
  taskId: string;
  projectId: string;
}

export interface FieldInputProps {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
}

export interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}
