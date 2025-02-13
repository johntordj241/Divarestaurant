import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { useMediaOptimization } from '../../hooks/useMediaOptimization';
import { useMedia } from '../../hooks/useMedia';

export function MediaUploader() {
  const { uploadMedia } = useMedia();
  const { optimizeMedia, isOptimizing, progress } = useMediaOptimization();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const optimizedFile = await optimizeMedia(selectedFile);
      await uploadMedia(optimizedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [selectedFile, optimizeMedia, uploadMedia]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ajouter un média</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <div className="flex items-center gap-2 text-gold hover:text-gold/80">
            <Upload size={20} />
            <span>Sélectionner un fichier</span>
          </div>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-gray-400" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {isOptimizing ? (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Optimisation en cours... {progress}%
              </p>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full bg-gold text-black py-2 rounded-md hover:bg-gold/90 transition-colors"
            >
              Télécharger
            </button>
          )}
        </div>
      )}
    </div>
  );
}