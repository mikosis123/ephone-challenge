import React, { useState } from "react";

interface MenuExtractorProps {
  onMenuItemsChange: (items: string[]) => void; // Prop type declaration for the callback
}

const Sidebar: React.FC<MenuExtractorProps> = ({ onMenuItemsChange }) => {
  const [inputText, setInputText] = useState<string>("");
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const extractMenuItems = () => {
    const menuRegex = /^\d+\.\s+(.*)$/gm;
    let match: RegExpExecArray | null;
    const items: string[] = [];

    while ((match = menuRegex.exec(inputText)) !== null) {
      items.push(match[1]);
    }

    if (items.length === 0) {
      setError("No valid menu items found");
    } else {
      setError("");
      onMenuItemsChange(items);
      setMenuItems(items); // Invoking the callback with the extracted items
    }
  };

  return (
    <div className="bg-blue-200">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Paste your text here..."
        style={{ width: "300px", height: "150px" }}
      />
      <button onClick={extractMenuItems}>Extract</button>
      <div>{error && <p>{error}</p>}</div>
      {!error && menuItems.map((item, index) => <p key={index}>{item}</p>)}
    </div>
  );
};

export default Sidebar;
