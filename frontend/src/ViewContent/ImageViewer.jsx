export function ImageViewer({ src, alt }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-screen object-contain"
        />
      </div>
    </div>
  );
}
