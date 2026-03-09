"use client";
import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Line } from "react-konva";
import Konva from "konva";
import { MapObject } from "@/objects/map.object";
import { getImage, getImages, toRupiahs } from "@/util/util";
import ENDPOINT from "@/config/url";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/util/request.util";
import { PreviewImage } from "../preview-image.component";

interface MapViewerProps {
  map: MapObject | null;
}

const MapViewer: React.FC<MapViewerProps> = ({ map }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [images, setImages] = useState<number[]>([]);

  // Selected unit id (unit.id)
  const [selectedUnitId, setSelectedUnitId] = useState<number | string | null | undefined>(null);

  useEffect(() => {
    async function loadImages() {
      const unit = map?.units?.find(u => u.id === selectedUnitId);
      setImages(await getImages(unit?.image ?? 0));
    }
    if (selectedUnitId != null) {
      loadImages();
    } else {
      setImages([]);
    }
  }, [selectedUnitId, map]);

  // Load image for background
  useEffect(() => {
    let isMounted = true;
    if (!map || !map.image) {
      setImage(null);
      return;
    }
    const loadImage = async () => {
      const img = new window.Image();
      const imageId = await getImage(map?.image ?? 0);
      img.src = `${ENDPOINT.DETAIL_IMAGE}/${imageId}`;
      img.onload = () => {
        if (isMounted) setImage(img);
      };
    };
    loadImage();
    return () => {
      isMounted = false;
    };
  }, [map && map.image]);

  // Zoom, pan state
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stageObj = e.target.getStage();
    const oldScale = stageObj?.scaleX();
    const pointer = stageObj?.getPointerPosition();
    if (!pointer || !stageObj || oldScale === undefined) return;
    const mousePointTo = {
      x: (pointer.x - (stageObj.x() ?? 0)) / oldScale,
      y: (pointer.y - (stageObj.y() ?? 0)) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // // Find unit by id
  // const getUnitById = (id: number | string | null) =>
  //   map?.units?.find((unit) => unit.id === id);

  async function deleteUnit(id: string | undefined): Promise<void> {
    try {
      await axiosInstance.delete(ENDPOINT.REMOVE_UNIT(id ?? 0));
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || "Gagal menghapus unit.");
    }
  }

  return (
    <div>
      <Link href={`/dashboard/unit/create/${map?.id}`}>
        <Button>Tambah Unit Baru <PlusIcon /></Button>
      </Link>
      <div className="flex flex-col items-start lg:flex-row p-6 bg-gray-100 min-h-screen gap-6">
        {/* Kiri: Canvas Editor */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl shadow-xl border border-gray-300">
            <Stage
              onWheel={handleWheel}
              scaleX={stage.scale}
              scaleY={stage.scale}
              x={stage.x}
              y={stage.y}
              draggable
              width={800}
              height={500}
            >
              <Layer>
                {image && (
                  <Image image={image} width={800} height={500} opacity={0.5} />
                )}

                {/* Render Multiple Static Meshes with highlight logic */}
                {map?.units?.map((mesh) =>
                  mesh?.visual_data ? (
                    <Line
                      key={mesh.id}
                      points={mesh.visual_data.points ?? []}
                      closed
                      opacity={
                        mesh.id === selectedUnitId
                          ? 0.65 /* highlight */
                          : 0.3
                      }
                      stroke={
                        mesh.id === selectedUnitId
                          ? "#6366f1" // Highlighted unit: indigo-500
                          : mesh.visual_data.color ?? "#ef4444"
                      }
                      strokeWidth={
                        mesh.id === selectedUnitId
                          ? 4 // thicker
                          : 2
                      }
                      fill={
                        mesh.id === selectedUnitId
                          ? "#6366f122" // highlighted with little fill (indigo-500 + opacity)
                          : (mesh.visual_data.color ?? "#ef4444") + "22"
                      }
                      dash={mesh.id === selectedUnitId ? undefined : [4, 4]}
                      // Clicking on this polygon selects it
                      onClick={() => setSelectedUnitId(mesh.id)}
                      onTap={() => setSelectedUnitId(mesh.id)}
                      perfectDrawEnabled={true}
                      listening={true}
                      shadowForStrokeEnabled={mesh.id === selectedUnitId}
                      shadowColor={mesh.id === selectedUnitId ? "#6366f1" : undefined}
                      shadowBlur={mesh.id === selectedUnitId ? 10 : undefined}
                      shadowEnabled={mesh.id === selectedUnitId}
                      globalCompositeOperation="source-over"
                      // Give pointer so user know clickable
                      onMouseEnter={e => {
                        if (mesh.id !== selectedUnitId) e.target.getStage()?.container().style.setProperty("cursor", "pointer");
                      }}
                      onMouseLeave={e => {
                        e.target.getStage()?.container().style.setProperty("cursor", "default");
                      }}
                    />
                  ) : null
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Kanan: Control Panel & Coordinates */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-y-auto max-h-[85vh]">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            Daftar Unit di Map
          </h3>
          <div className="space-y-4">
            {map?.units && map.units.length === 0 && (
              <div className="text-gray-400 p-4 text-center">Belum ada unit di map ini.</div>
            )}
            {map?.units?.map((unit, i) =>
              unit?.visual_data ? (
                <div
                  key={unit.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer
                  ${selectedUnitId === unit.id
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300 shadow"
                      : "bg-gray-50 border-gray-200 hover:border-indigo-400"}
                `}
                  onClick={() => setSelectedUnitId(unit.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-[0.9rem] 
                    ${selectedUnitId === unit.id
                        ? "text-indigo-600"
                        : "text-gray-900"}
                  `}>
                      {unit.unit_number || `Unit ${i + 1}`}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      #{unit.id}
                    </span>
                  </div>
                  <div className="mb-1 text-gray-500 text-xs">
                    <span className="font-bold">{(unit.visual_data.points?.length || 0) / 2}</span>{" "}
                    titik
                  </div>
                  <div className="overflow-x-auto text-xs text-gray-700 font-mono break-all">
                    [
                    {(unit.visual_data.points ?? [])
                      .map((p) => Math.round(p))
                      .join(", ")}
                    ]
                  </div>
                  <Button onClick={() => deleteUnit(unit.id)}><Trash2Icon /></Button>
                </div>
              ) : null
            )}
          </div>

          {/* Move the stateful logic into a child component to avoid conditional hook calls */}

        </div>
      </div>
      {selectedUnitId && (() => {
        const unit = map?.units?.find(u => u.id === selectedUnitId);
        if (!unit) return null;
        return (
          <div className="mt-6 p-4 rounded-lg border bg-white shadow-inner">
            <h4 className="text-lg font-bold text-indigo-700 border-b pb-1 mb-2 flex items-center gap-2">
              <span>Detail Unit</span>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 font-mono font-bold">#{unit.id}</span>
            </h4>
            <div className="space-y-2 text-sm text-gray-700">

              {/* Unit Number */}
              <div>
                <span className="font-semibold text-gray-500">Nomor: </span>
                <span className="font-mono">{unit.unit_number || <span className="italic text-gray-400">-</span>}</span>
              </div>

              {/* Status */}
              <div>
                <span className="font-semibold text-gray-500">Status: </span>
                <span className={
                  `inline-block rounded px-2 py-[2px] text-xs font-semibold 
                     ${unit.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : unit.status === 'sold'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-700'}`
                }>
                  {unit.status || <span className="italic text-gray-400">-</span>}
                </span>
              </div>

              {/* Visual Data */}
              <div>
                <span className="font-semibold text-gray-500">Label Visual: </span>
                <span>{unit.visual_data?.label || <span className="italic text-gray-400">-</span>}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-500">Warna: </span>
                <span className="inline-block align-middle w-5 h-5 rounded border border-gray-300" style={{ background: unit.visual_data?.color }} ></span>
                <span className="font-mono text-xs">{unit.visual_data?.color}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500">Titik Polygon:</span>
                <div className="ml-2 font-mono text-xs text-gray-600 break-all">
                  [
                  {(unit.visual_data?.points ?? []).map(p => Math.round(p)).join(", ")}
                  ]
                </div>
                <span className="ml-2 text-gray-400">
                  ({(unit.visual_data?.points?.length ?? 0) / 2} titik)
                </span>
              </div>

              {/* Price Override */}
              <div>
                <span className="font-semibold text-gray-500">Harga Override: </span>
                <span className="font-mono">
                  {Number(unit.price_override) > 0 ? toRupiahs(unit.price_override ?? 0) : <span className="italic text-gray-400">-</span>}
                </span>
              </div>

              {/* Category */}
              <div>
                <span className="font-semibold text-gray-500">Kategori ID: </span>
                <span className="font-mono">{unit.category?.id || <span className="italic text-gray-400">-</span>}</span>
              </div>

              {/* Image ID */}
              <div>
                <span className="font-semibold text-gray-500">Image ID: </span>
                <span className="font-mono">{images.length > 0 && (
                  <div>
                    {images.map((img) => (
                      <PreviewImage
                        src={`${ENDPOINT.DETAIL_IMAGE}/${img}`}
                        alt="Violation evidence"
                        className="rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                      />
                    ))}
                  </div>
                )}</span>
              </div>

              {/* Map ID */}
              <div>
                <span className="font-semibold text-gray-500">Map ID: </span>
                <span className="font-mono">{unit?.map?.id || <span className="italic text-gray-400">-</span>}</span>
              </div>

              {/* Additional Properties */}
              {unit.additional_properties && unit.additional_properties.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-500">Properti Tambahan:</span>
                  <ul className="ml-2 mt-1 space-y-1">
                    {unit.additional_properties.map((prop: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="inline-block bg-gray-200 rounded px-2 py-[2px] font-mono text-[.95em] text-gray-700">{prop.key}</span>
                        <span className="font-mono text-gray-900">{prop.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MapViewer;
