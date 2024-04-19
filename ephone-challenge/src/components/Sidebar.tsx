import React, { useState } from "react";

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
    <div className="bg-blue-200 p-4">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Paste your text here..."
        style={{ width: "100%", height: "150px", marginBottom: "10px" }}
      />
      <button onClick={extractMenuItems}>Extract</button>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      {!error &&
        menuItems.map((item, index) => (
          <div key={index}>
            {editId === item.id ? (
              <div>
                <input value={editText} onChange={handleEditChange} />
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                <p>
                  {item.id}: {item.label}
                </p>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
