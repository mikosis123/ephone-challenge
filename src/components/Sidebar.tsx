import React, { useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Input } from "@mui/base/Input";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Button } from "@mui/material";

interface MenuItem {
  id: string;
  label: string;
}

interface MenuExtractorProps {
  onMenuItemsChange: (items: MenuItem[]) => void; // Updated to handle MenuItem[]
}

const Sidebar: React.FC<MenuExtractorProps> = ({ onMenuItemsChange }) => {
  const [inputText, setInputText] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const extractMenuItems = () => {
    const menuRegex = /^(\d+)\.\s+(.*)$/gm;
    let match: RegExpExecArray | null;
    const items: MenuItem[] = [];

    while ((match = menuRegex.exec(inputText)) !== null) {
      items.push({ id: match[1], label: match[2] }); // Construct MenuItem objects
    }

    if (items.length === 0) {
      setError("No valid menu items found");
    } else {
      setError("");
      setMenuItems(items);
      onMenuItemsChange(items); // Call the prop function with the new items list
    }
    setInputText("");
  };

  const handleDeleteItem = (id: string) => {
    const updatedMenuItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(updatedMenuItems);
    onMenuItemsChange(updatedMenuItems); // Also update the parent component state
  };
  const handleEdit = (item: MenuItem) => {
    setEditId(item.id);
    setEditText(item.label);
  };

  const handleSaveEdit = () => {
    const updatedMenuItems = menuItems.map((item) =>
      item.id === editId ? { ...item, label: editText } : item
    );
    setMenuItems(updatedMenuItems);
    onMenuItemsChange(updatedMenuItems); // Update the parent component
    setEditId(null); // Clear edit mode
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <div className="bg-blue-200 p-4 w-1/4 flex flex-col">
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        placeholder="1. menu item "
        value={inputText}
        onChange={handleInputChange}
        className="w-full mb-4 border border-[#3730a3] rounded-md p-2"
      />
      <Button variant="contained" onClick={extractMenuItems}>
        Extract
      </Button>
      <h3 className="mt-4 font-bold text-xl">Menu Items</h3>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      {!error &&
        menuItems.map((item, index) => (
          <div key={index}>
            {editId === item.id ? (
              <div className="flex gap-4">
                <input
                  className="border border-[#3730a3] rounded-md p-2"
                  value={editText}
                  onChange={handleEditChange}
                />

                <button onClick={handleSaveEdit}>
                  <SaveAsIcon className="text-[#3730a3]" />
                </button>
              </div>
            ) : (
              <div className="flex gap-14 mt-4 justify-between">
                <p className="text-lg wrap text-[#3730a3]">
                  {item.id}. {item.label}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)}>
                    <ModeEditIcon className="text-[#3730a3]" />
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon className="text-[#dc2626]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
