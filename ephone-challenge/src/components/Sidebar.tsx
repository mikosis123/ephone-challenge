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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const extractMenuItems = () => {
    const menuRegex = /^(\d+)\.\s+(.*)$/gm; // Updated regex to capture the number
    let match: RegExpExecArray | null;
    const items: MenuItem[] = [];

    while ((match = menuRegex.exec(inputText)) !== null) {
      items.push({ id: match[1], label: match[2] }); // Construct MenuItem objects
    }

    if (items.length === 0) {
      setError("No valid menu items found");
    } else {
      setError("");
      onMenuItemsChange(items);
      setMenuItems(items);
    }
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
          <p key={index}>
            {item.id}: {item.label}
          </p>
        ))}
    </div>
  );
};

export default Sidebar;
