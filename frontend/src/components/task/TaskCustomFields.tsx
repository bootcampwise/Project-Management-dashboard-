import React, { useState } from "react";
import {
  Plus,
  X,
  Type,
  Hash,
  Calendar,
  ChevronDown,
  Trash2,
} from "lucide-react";
import {
  useGetProjectCustomFieldsQuery,
  useGetTaskCustomFieldValuesQuery,
  useCreateCustomFieldMutation,
  useSetCustomFieldValueMutation,
  useDeleteCustomFieldMutation,
} from "../../store/api/customFieldApiSlice";
import { showToast } from "../ui";
import type {
  CustomFieldType,
  TaskCustomFieldsProps,
  FieldInputProps,
  AddFieldModalProps,
} from "../../types";

const fieldTypeIcons: Record<CustomFieldType, React.ReactNode> = {
  TEXT: <Type size={14} />,
  NUMBER: <Hash size={14} />,
  DATE: <Calendar size={14} />,
  SELECT: <ChevronDown size={14} />,
};

const fieldTypeLabels: Record<CustomFieldType, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  DATE: "Date",
  SELECT: "Dropdown",
};

const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange }) => {
  const baseClasses =
    "w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200";

  switch (field.type) {
    case "TEXT":
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text..."
          className={baseClasses}
        />
      );
    case "NUMBER":
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={baseClasses}
        />
      );
    case "DATE":
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        />
      );
    case "SELECT":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        >
          <option value="">Select...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    default:
      return null;
  }
};

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomFieldType>("TEXT");
  const [options, setOptions] = useState<string[]>([""]);

  const [createField, { isLoading }] = useCreateCustomFieldMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createField({
        name: name.trim(),
        type,
        options:
          type === "SELECT" ? options.filter((o) => o.trim()) : undefined,
        projectId,
      }).unwrap();
      onClose();
      setName("");
      setType("TEXT");
      setOptions([""]);
    } catch (error) {
      console.error("Failed to create custom field:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Custom Field
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sprint, Story Points"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Field Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(fieldTypeLabels) as CustomFieldType[]).map(
                (fieldType) => (
                  <button
                    key={fieldType}
                    type="button"
                    onClick={() => setType(fieldType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      type === fieldType
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {fieldTypeIcons[fieldType]}
                    <span className="text-sm">
                      {fieldTypeLabels[fieldType]}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {type === "SELECT" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOptions(options.filter((_, i) => i !== index))
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOptions([...options, ""])}
                disabled={options.some((opt) => !opt.trim())}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskCustomFields: React.FC<TaskCustomFieldsProps> = ({
  taskId,
  projectId,
}) => {
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: customFields = [] } = useGetProjectCustomFieldsQuery(projectId);
  const { data: fieldValues = [] } = useGetTaskCustomFieldValuesQuery(taskId);
  const [setFieldValue] = useSetCustomFieldValueMutation();
  const [deleteField] = useDeleteCustomFieldMutation();

  const getFieldValue = (fieldId: string): string => {
    const fieldValue = fieldValues.find((fv) => fv.customFieldId === fieldId);
    return fieldValue?.value || "";
  };

  const handleSaveValue = async (fieldId: string) => {
    try {
      await setFieldValue({
        fieldId,
        taskId,
        value: editValue,
      }).unwrap();
      setEditingFieldId(null);
      setEditValue("");
    } catch (error) {
      console.error("Failed to save field value:", error);
    }
  };

  const handleStartEdit = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setEditValue(getFieldValue(fieldId));
  };

  const handleDeleteField = (fieldId: string, fieldName: string) => {
    showToast.confirm({
      title: "Delete Custom Field?",
      message: `Permanently delete "${fieldName}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteField({ id: fieldId, projectId }).unwrap();
          showToast.success("Custom field deleted");
        } catch (error) {
          console.error("Failed to delete field:", error);
        }
      },
      confirmText: "Delete",
      variant: "danger",
    });
  };

  return (
    <>
      {customFields.length > 0 && (
        <div className="grid grid-cols-[120px_1fr] gap-y-4 mb-4 text-sm">
          {customFields.map((field) => (
            <React.Fragment key={field.id}>
              <div className="text-gray-500 dark:text-gray-400 font-medium py-1 flex items-center gap-1 group">
                {fieldTypeIcons[field.type]}
                {field.name}
                <button
                  onClick={() => handleDeleteField(field.id, field.name)}
                  className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  title="Delete custom field"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div>
                {editingFieldId === field.id ? (
                  <div className="flex items-center gap-2">
                    <FieldInput
                      field={field}
                      value={editValue}
                      onChange={setEditValue}
                    />
                    <button
                      onClick={() => handleSaveValue(field.id)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingFieldId(null)}
                      className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(field.id)}
                    className="text-gray-700 dark:text-gray-200 py-1 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer min-w-[80px] text-left"
                  >
                    {getFieldValue(field.id) || (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsAddFieldModalOpen(true)}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium mb-8 flex items-center gap-1 transition-colors"
      >
        <Plus size={16} />
        Add custom field
      </button>

      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default TaskCustomFields;
