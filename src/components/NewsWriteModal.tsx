import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Image, AlertCircle, Sparkles } from "lucide-react";
import { Post } from "../types";
import heic2any from "heic2any";

interface NewsWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: Post | null;
  onSave: (post: { id?: number; title: string; category: string; content: string; image_url: string }) => Promise<void>;
}

const PRESET_IMAGES = [
  { id: "mind", label: "마음 치유", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" },
  { id: "education", label: "교육/강의", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" },
  { id: "workshop", label: "세미나/행사", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80" },
  { id: "nature", label: "자연/행복", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" }
];

export default function NewsWriteModal({ isOpen, onClose, onSave, postToEdit }: NewsWriteModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("공지사항");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing post details into state if editing
  useEffect(() => {
    if (isOpen) {
      if (postToEdit) {
        setTitle(postToEdit.title);
        setCategory(postToEdit.category);
        setContent(postToEdit.content);
        
        // Parse multiple images if it is a JSON array
        const imgUrl = postToEdit.image_url || "";
        if (imgUrl.startsWith("[") && imgUrl.endsWith("]")) {
          try {
            const parsed = JSON.parse(imgUrl);
            if (Array.isArray(parsed)) {
              setImageUrls(parsed);
            } else {
              setImageUrls(imgUrl ? [imgUrl] : []);
            }
          } catch (e) {
            setImageUrls(imgUrl ? [imgUrl] : []);
          }
        } else {
          setImageUrls(imgUrl ? [imgUrl] : []);
        }
      } else {
        setTitle("");
        setCategory("공지사항");
        setContent("");
        setImageUrls([]);
      }
      setError("");
    }
  }, [isOpen, postToEdit]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const currentLength = imageUrls.length;
      const filesToProcess = Array.from(e.target.files).slice(0, 3 - currentLength);
      if (filesToProcess.length < e.target.files.length) {
        setError("이미지는 최대 3개까지만 등록할 수 있습니다.");
      }
      filesToProcess.forEach((file: any) => {
        processFile(file);
      });
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const processFile = async (file: File) => {
    let fileToProcess = file;
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isHeic = fileExtension === 'heic' || fileExtension === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';
    
    setError("");

    if (isHeic) {
      try {
        setLoading(true);
        const conversionResult = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        });
        
        const convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        fileToProcess = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: "image/jpeg"
        });
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        setError("HEIC 이미지 변환에 실패했습니다. 다른 형식의 이미지를 사용해 주세요.");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'svg', 'tiff'];
    const isImage = fileToProcess.type.startsWith("image/") || validExtensions.includes(fileExtension);
    
    if (!isImage) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const base64Url = event.target.result as string;
        const img = new window.Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
              setImageUrls(prev => {
                if (prev.length >= 3) return prev;
                if (prev.includes(compressedBase64)) return prev;
                return [...prev, compressedBase64];
              });
            } else {
              setImageUrls(prev => {
                if (prev.length >= 3) return prev;
                if (prev.includes(base64Url)) return prev;
                return [...prev, base64Url];
              });
            }
          } catch (e) {
            setImageUrls(prev => {
              if (prev.length >= 3) return prev;
              if (prev.includes(base64Url)) return prev;
              return [...prev, base64Url];
            });
          }
        };

        img.onerror = () => {
          setImageUrls(prev => {
            if (prev.length >= 3) return prev;
            if (prev.includes(base64Url)) return prev;
            return [...prev, base64Url];
          });
        };

        img.src = base64Url;
      }
    };

    reader.onerror = () => {
      setError("파일을 읽는데 실패했습니다.");
    };

    reader.readAsDataURL(fileToProcess);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const currentLength = imageUrls.length;
      const filesToProcess = Array.from(e.dataTransfer.files).slice(0, 3 - currentLength);
      if (filesToProcess.length < e.dataTransfer.files.length) {
        setError("이미지는 최대 3개까지만 등록할 수 있습니다.");
      }
      filesToProcess.forEach((file: any) => {
        processFile(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      let finalImageUrl = "";
      if (imageUrls.length > 0) {
        finalImageUrl = JSON.stringify(imageUrls);
      } else {
        // If no image is uploaded/selected, default to a nice unsplash preset based on category
        let defaultUrl = "";
        if (category === "행사사진") {
          defaultUrl = PRESET_IMAGES[2].url; // workshop
        } else if (category === "강사활동") {
          defaultUrl = PRESET_IMAGES[1].url; // education
        } else {
          defaultUrl = PRESET_IMAGES[0].url; // mind
        }
        finalImageUrl = JSON.stringify([defaultUrl]);
      }

      await onSave({
        id: postToEdit?.id,
        title: title.trim(),
        category,
        content: content.trim(),
        image_url: finalImageUrl
      });

      // Reset form
      setTitle("");
      setCategory("공지사항");
      setContent("");
      setImageUrls([]);
      onClose();
    } catch (err: any) {
      const errMsg = err.message || "";
      if (
        errMsg.includes("too large") || 
        errMsg.includes("Payload Too Large") || 
        errMsg.includes("Request Entity Too Large")
      ) {
        setError("네트워크 전송 용량 제한을 초과했습니다. 이미지를 더 작게 조절하거나 사진 장수를 줄여서 다시 시도해 주세요.");
      } else {
        setError(errMsg || "게시글 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              {postToEdit ? "마음지키미 소식 수정" : "마음지키미 새 소식 등록"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {postToEdit ? "선택한 마음지키미 소식의 내용을 변경합니다." : "공지사항, 행사사진, 강사활동 게시글을 등록합니다."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-grow">
          {error && (
            <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-2 text-red-600 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
            <input 
              type="text"
              placeholder="게시글의 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium text-gray-800"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">게시판 구분</label>
            <div className="grid grid-cols-3 gap-3">
              {["공지사항", "행사사진", "강사활동"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                    category === cat 
                      ? "bg-primary/10 border-primary text-primary shadow-sm" 
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
            <textarea 
              rows={5}
              placeholder="전하고 싶은 따뜻한 소식 내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium text-gray-800 resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">이미지 등록 (최대 3장 등록 가능)</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {/* Existing/Added Images */}
              {imageUrls.map((url, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-gray-100 bg-gray-50 group">
                  <img 
                    src={url} 
                    alt={`Uploaded preview ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrls(imageUrls.filter((_, idx) => idx !== index));
                      }}
                      className="w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Index badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-lg text-[10px] font-bold text-white">
                    {index === 0 ? "대표 이미지 ★" : `사진 ${index + 1}`}
                  </div>
                </div>
              ))}

              {/* Add Image Slot */}
              {imageUrls.length < 3 && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    dragActive 
                      ? "border-primary bg-primary/5 scale-[0.99]" 
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center px-2">
                    <p className="font-bold text-gray-700 text-xs">이미지 추가</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">클릭/드래그</p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex gap-3 px-8 py-6 border-t border-gray-100 flex-shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md cursor-pointer text-center flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              postToEdit ? "소식 수정 완료" : "소식 게시하기"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
