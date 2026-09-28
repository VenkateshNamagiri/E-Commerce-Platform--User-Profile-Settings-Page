import { useState, useRef } from 'react'

/**
 * A drag-and-drop zone that also supports click-to-browse.
 * Calls onFilesSelected(fileList) with whatever files were dropped or picked.
 * `progress` (0-100) shows a progress bar while an upload is in flight;
 * pass null/undefined to hide it.
 */
export default function DropzoneUpload({
  onFilesSelected,
  multiple = false,
  accept = 'image/png, image/jpeg, image/webp',
  progress = null,
  label = 'Drag & drop an image here, or click to browse',
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.length) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  function handleInputChange(e) {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files)
    }
    e.target.value = '' // allow re-selecting the same file later
  }

  return (
    <div
      className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      <div className="dropzone-icon">⬆</div>
      <p className="dropzone-label">{label}</p>

      {progress !== null && progress !== undefined && (
        <div className="upload-progress-track">
          <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
          <span className="upload-progress-text">{progress}%</span>
        </div>
      )}
    </div>
  )
}
