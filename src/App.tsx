import React, { useState } from 'react'

import type { FileEntry } from './models';
import './App.css'

function App(): React.JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [list, setList] = useState<FileEntry[]>([]);

  const handleDragOver = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleFileDrop = (event: React.DragEvent) => {
    setIsDragging(false);

    for (let file of event.dataTransfer.files) {
      // TODO: only supported formats
      // TODO: check for directories
      // TODO: parse directories recursively
      setList((items: FileEntry[]): FileEntry[] => [
        ...items,
        {
          addedAt: Date.now(),
          name: file.name,
          path: file.path,
          sizeBytes: file.size,
          type: file.type,
        },
      ]);
    }
  };

  const toggleDragging = () => setIsDragging((value: boolean) => !value);

  return (
    <div className="App">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={toggleDragging}
        onDragOver={handleDragOver}
        onDragLeave={toggleDragging}
        onDrop={handleFileDrop}
      >
        { list.length > 0 && list.map((item: FileEntry) => (
          <div key={`${item.addedAt}${item.path}`}>
            { `${item.name} (added: ${item.addedAt})` }
          </div>
        )) }
      </div>
      <input
        onChange={console.log}
        type="file"
      />
    </div>
  )
}

export default React.memo(App)
