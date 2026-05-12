'use client'
import { Button } from "@/components/ui/button";
import { convertHeic, getImages } from "@/util/util";
import { RefreshCcwDotIcon, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PreviewImage } from "../preview-image.component";
import ENDPOINT from "@/config/url";

export default function UploadViolationImages({
    files,
    setFiles,
    maxFiles,
    disabled,
    existingImages,
    deletedImages,
    setDeletedImages
}: {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles: number
    disabled?: boolean
    existingImages?: number | null,
    deletedImages?: number[],
    setDeletedImages?: React.Dispatch<React.SetStateAction<number[]>>,
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [existedImages, setExistedImages] = useState<number[]>([])

    useEffect(() => {
        async function loadImage() {
            if (existingImages) {
                setExistedImages(await getImages(existingImages))
            }
        }
        loadImage();
    }, [existingImages])

    // Use booleans for state logic
    const isMaxReached: boolean = files.length >= maxFiles;
    const isButtonDisabled: boolean = loading || isMaxReached || !!disabled;

    // Helper to truncate too many files if selected
    const processSelectedFiles = async (selectedFiles: File[]) => {
        const allowedCount: number = Math.max(maxFiles - files.length, 0);
        if (allowedCount === 0) return [];
        const finalFiles = selectedFiles.slice(0, allowedCount);

        return await Promise.all(
            finalFiles.map(async (file) => {
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (ext === "heic") {
                    return await convertHeic(file).then((a) => a);
                }
                return file;
            })
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-rows-2 md:grid-rows-1 gap-3">
                <Button
                    type="button"
                    disabled={isButtonDisabled}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            Memuat...
                        </span>
                    ) : (
                        isMaxReached ? `Maksimal ${maxFiles} file` : "Pilih Gambar Dari File"
                    )}
                </Button>
                <Button
                    disabled={isButtonDisabled}
                    type="button"
                    onClick={() => fileInputRef2.current?.click()}
                    className="md:hidden"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            Memuat...
                        </span>
                    ) : (
                        isMaxReached ? `Maksimal ${maxFiles} file` : "Buka Kamera"
                    )}
                </Button>
            </div>
            <input
                ref={fileInputRef}
                accept="image/*,.heic"
                type="file"
                multiple
                className="hidden"
                onChange={async (e) => {
                    setLoading(true);
                    if (!e.target.files) {
                        setLoading(false);
                        return;
                    }

                    const selectedFiles: File[] = Array.from(e.target.files);
                    const processedFiles: File[] = await processSelectedFiles(selectedFiles);

                    setFiles((prev) => [...prev, ...processedFiles]);
                    setLoading(false);
                    e.target.value = "";
                }}
            />

            <input
                ref={fileInputRef2}
                accept="image/*,.heic"
                type="file"
                multiple
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                    setLoading(true);
                    if (!e.target.files) {
                        setLoading(false);
                        return;
                    }

                    const selectedFiles: File[] = Array.from(e.target.files);
                    const processedFiles: File[] = await processSelectedFiles(selectedFiles);

                    setFiles((prev) => [...prev, ...processedFiles]);
                    setLoading(false);
                    e.target.value = "";
                }}
            />

            <div>Gambar yang sudah ada</div>
            {Boolean(existedImages.length) &&
                <div className="border flex flex-wrap gap-4 border-slate-300 p-4 rounded-sm">
                    {existedImages.map((file, i) => {
                        return (
                            <div key={i} className="w-1/4 p-2 flex flex-col justify-center border border-slate-300 rounded hover:scale-[99%]">
                                <PreviewImage src={`${ENDPOINT.DETAIL_IMAGE}/${file}`} />
                                <Button type="button" onClick={() => {
                                    setExistedImages(existedImages.filter((f) => f !== file))
                                    if(setDeletedImages) setDeletedImages((e) => [...e, file]);
                                }}>
                                    <Trash /></Button>
                            </div>
                        );
                    })}
                    {deletedImages?.map((file, i) => {
                        return (
                            <div key={i} className="w-1/4 opacity-55 p-2 flex flex-col justify-center border border-slate-300 rounded hover:scale-[99%]">
                                <PreviewImage src={`${ENDPOINT.DETAIL_IMAGE}/${file}`} />
                                <Button type="button" onClick={() => {
                                    setExistedImages((e) => [...e, file])
                                    if(setDeletedImages)  setDeletedImages(deletedImages.filter((f) => f !== file));
                                }}>
                                    <RefreshCcwDotIcon /></Button>
                            </div>
                        );
                    })}
                </div>
            }

            <div>Gambar Tambahan</div>
            {Boolean(files.length) &&
                <div className="border flex flex-wrap gap-4 border-slate-300 p-4 rounded-sm">
                    {files.map((file) => {
                        const ext: string | undefined = file.name.split('.').pop()?.toLowerCase();
                        const isHeic: boolean = ext === "heic";
                        return (
                            <div key={file.name} className="w-1/4 p-2 flex flex-col justify-center border border-slate-300 rounded hover:scale-[99%]">
                                {isHeic ? (
                                    <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center">
                                        <span className="block text-gray-700 text-sm mb-1">HEIC</span>
                                        <span className="block text-gray-400 text-xs">Preview not supported</span>
                                    </div>
                                ) : (
                                    <PreviewImage className="w-full h-auto" src={URL.createObjectURL(file)} alt={file.name} />
                                )}
                                <p className="text-center text-sm ">
                                    {file.name.length > 20 ? (
                                        <>{file.name.slice(0, 8)}...{file.name.split('.').pop()}</>
                                    ) : (
                                        file.name
                                    )}
                                </p>
                                <Button type="button" onClick={() => setFiles(files.filter((f) => f.name !== file.name))}><Trash /></Button>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
}