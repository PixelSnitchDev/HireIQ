import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload } from "lucide-react";

export default function UploadZone({ files, setFiles }) {
  const onDrop = useCallback((accepted) => {
    setFiles(prev => [...prev, ...accepted]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? "#5c35f5" : "#f0997b"}`,
          borderRadius: "10px",
          padding: "26px 12px",
          textAlign: "center",
          background: "#fdf6f3",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        <input {...getInputProps()} />
        <Upload size={28} color="#d85a30" style={{ margin: "0 auto 8px" }} />
        <p style={{ fontSize: "13px", color: "#712b13" }}>
          Drag & drop or <span style={{ color: "#5c35f5", fontWeight: 500 }}>browse files</span>
        </p>
        <p style={{ fontSize: "11px", color: "#b4b2a9", marginTop: "3px" }}>
          PDF only · multiple supported
        </p>
      </div>

      {files.map((file, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#fdf6f3", borderRadius: "8px", padding: "8px 12px",
          marginTop: "8px", border: "1px solid #f5c4b3"
        }}>
          <FileText size={15} color="#d85a30" />
          <span style={{ fontSize: "12px", color: "#4a1b0c", flex: 1 }}>{file.name}</span>
          <button
            onClick={() => setFiles(files.filter((_, j) => j !== i))}
            style={{ fontSize: "11px", color: "#f0997b", background: "none", border: "none", cursor: "pointer" }}
          >✕</button>
        </div>
      ))}
    </div>
  );
}