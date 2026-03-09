"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { Stage, Layer, Image, Line, Circle, Group } from "react-konva";
import Konva from "konva";
import { MapObject } from "@/objects/map.object";
import { getImage } from "@/util/util";
import ENDPOINT from "@/config/url";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/util/request.util";
import { useRouter } from "next/navigation";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import { UnitCategoryObject } from "@/objects/unit-category.object";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadViolationImages from "../violation/upload-violation-image.component";

interface AdditionalProperty {
  key: string;
  value: string;
}

interface CreateUnitProps {
  map: MapObject | null;
}

const defaultPoints = [100, 100, 300, 100, 300, 300, 100, 300];

const CreateUnit: React.FC<CreateUnitProps> = ({ map }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [points, setPoints] = useState<number[]>([...defaultPoints]);
  const [unitNumber, setUnitNumber] = useState("");
  const [status, setStatus] = useState("available");
  const [visualLabel, setVisualLabel] = useState("");
  const [visualColor, setVisualColor] = useState("#d1c81b");
  const [priceOverride, setPriceOverride] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageId, setImageId] = useState<number>(0);
  const [additionalProperties, setAdditionalProperties] = useState<AdditionalProperty[]>([]);
  const [newPropertyKey, setNewPropertyKey] = useState("");
  const [newPropertyValue, setNewPropertyValue] = useState("");
  const router = useRouter()
  const { data: unitCategoryData, ref } = useInfiniteScroll<UnitCategoryObject, HTMLDivElement>({ filter: {}, take: 10, url: ENDPOINT.LIST_UNIT_CATEGORY })

  useEffect(() => {
    if (!map || !map.image) {
      setImage(null);
      return;
    }
    async function loadImage() {
      const img = new window.Image();
      const imageIdVal = await getImage(map?.image ?? 0);
      img.src = `${ENDPOINT.DETAIL_IMAGE}/${imageIdVal}`;
      setImage(img);
      setImageId(imageIdVal);
    }
    loadImage();
  }, [map && map.image, map]);

  const updateCoordinate = (index: number, axis: "x" | "y", value: number) => {
    const newPoints = [...points];
    newPoints[index * 2 + (axis === "y" ? 1 : 0)] = value;
    setPoints(newPoints);
  };

  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const removePoint = (index: number) => {
    if (points.length <= 6) return;
    const newPoints = [...points];
    newPoints.splice(index * 2, 2);
    setPoints(newPoints);
  };

  const handleDragPoint = (index: number, e: Konva.KonvaEventObject<DragEvent>) => {
    const newPoints = [...points];
    newPoints[index * 2] = Math.round(e.target.x());
    newPoints[index * 2 + 1] = Math.round(e.target.y());
    setPoints(newPoints);
  };

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

  const handleAddProperty = () => {
    if (
      newPropertyKey.trim() !== "" &&
      newPropertyValue.trim() !== ""
    ) {
      setAdditionalProperties([
        ...additionalProperties,
        { key: newPropertyKey.trim(), value: newPropertyValue.trim() },
      ]);
      setNewPropertyKey("");
      setNewPropertyValue("");
    }
  };

  const handleRemoveProperty = (idx: number) => {
    setAdditionalProperties(additionalProperties.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageId: number | undefined = undefined;
    if (files.length !== 0) {
      try {
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const res = await axiosInstance.post(ENDPOINT.UPLOAD_IMAGE, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageId = res.data.data;
      } catch (error) {
        console.error(error);
        // toaster.toast({
        //   description: "Data Gagal Di Input",
        //   title: "Gagal",
        //   variant: "destructive",
        // });
        // setDialogVisibility(false);
        // setIsLoading(false);
        return;
      } finally {
        // setProgress(0);
      }
    }

    const data = {
      unit_number: unitNumber,
      status,
      visual_data: {
        label: visualLabel,
        color: visualColor,
        points: points.map(p => Math.round(p)),
      },
      price_override: priceOverride,
      map_id: map?.id,
      category_id: categoryId,
      image_id: imageId,
      additional_properties: additionalProperties,
    };

    await axiosInstance.post(ENDPOINT.CREATE_UNIT, data).then(() => {
      router.push(`/dashboard/map/${map?.id}`)
    })

    // TODO: Handle submit (API or pass up)
    alert("Unit Created!\n\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="">
      <div>
        <h2 className="text-xl font-bold mb-2">Informasi Unit</h2>
      </div>

      <div className="flex flex-col items-start lg:flex-row p-6 bg-gray-100 min-h-screen gap-6">
        {/* Kiri: Canvas Editor */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() =>
                setPoints([
                  ...points,
                  points[points.length - 2] + 20,
                  points[points.length - 1] + 20,
                ])
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-700"
            >
              Tambah Titik +
            </button>
          </div>

          <Button onClick={() => { if (map?.image) { setImage(null); } }}>Muat Ulang Gambar</Button>

          <div className="bg-white p-2 rounded-xl shadow-xl border border-gray-300 mt-4">
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

                {/* Render Static Meshes */}
                {map?.units?.map((mesh) =>
                  mesh?.visual_data ? (
                    <Line
                      key={mesh.id}
                      points={mesh.visual_data.points ?? []}
                      closed
                      opacity={0.3}
                      stroke={mesh.visual_data.color ?? "#ef4444"}
                      strokeWidth={2}
                      fill={`${mesh.visual_data.color ?? "#ef4444"}22`}
                      dash={[4, 4]}
                    />
                  ) : null
                )}

                {/* Editable Mesh */}
                <Group>
                  <Line
                    points={points}
                    closed
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="rgba(16, 185, 129, 0.1)"
                  />
                  {Array.from({ length: points.length / 2 }).map((_, i) => (
                    <Circle
                      key={i}
                      x={points[i * 2]}
                      y={points[i * 2 + 1]}
                      radius={8}
                      fill="white"
                      opacity={0.4}
                      stroke="#10b981"
                      strokeWidth={2}
                      draggable
                      onDragMove={(e) => handleDragPoint(i, e)}
                      onMouseEnter={(e) =>
                        (e.target.getStage()!.container().style.cursor = "move")
                      }
                      onMouseLeave={(e) =>
                        (e.target.getStage()!.container().style.cursor = "default")
                      }
                    />
                  ))}
                </Group>
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Kanan: Control Panel & Form */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-y-auto max-h-[85vh]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Data Unit Lengkap
            </h3>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Nomor Unit
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={e => setUnitNumber(e.target.value)}
                className="w-full border px-3 py-2 rounded text-gray-900 bg-gray-50"
                placeholder="Contoh: A4"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded text-gray-900 bg-gray-50"
                required
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
                <option value="hold">Hold</option>
              </select>
            </div>

            {/* Visual Data */}
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Label pada Polygon
              </label>
              <input
                type="text"
                value={visualLabel}
                onChange={e => setVisualLabel(e.target.value)}
                className="w-full border px-3 py-2 rounded text-gray-900 bg-gray-50"
                placeholder="Contoh: Nomor A4"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Warna Polygon
              </label>
              <input
                type="color"
                value={visualColor}
                onChange={e => setVisualColor(e.target.value)}
                className="h-8 w-32 border px-2 py-1 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Harga Override (Opsional)
              </label>
              <input
                type="number"
                value={priceOverride > 0 ? priceOverride : ""}
                onChange={e => setPriceOverride(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded text-gray-900 bg-gray-50"
                placeholder="400000000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Kategori Unit
              </label>
              <div className="w-full">
                <Select
                  value={categoryId?.toString()}
                  onValueChange={val => setCategoryId(Number(val))}
                  required
                >
                  <SelectTrigger className="w-full border px-3 py-2 rounded text-gray-900 bg-gray-50">
                    <SelectValue placeholder="Pilih kategori unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitCategoryData &&
                      unitCategoryData.map((cat,i) => (
                        <SelectItem key={i} value={cat.id?.toString() ?? "a"}>
                          {cat.name} (ID: {cat.id})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
            <UploadViolationImages files={files} setFiles={setFiles} />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Map ID (Otomatis)
              </label>
              <input
                type="number"
                value={map?.id ?? ""}
                readOnly
                className="w-full border px-3 py-2 rounded text-gray-500 bg-gray-100"
              />
            </div>

            {/* Additional Properties */}
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">
                Additional Properties
              </label>
              <div className="space-y-2 mb-2">
                {additionalProperties.map((prop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prop.key}
                      disabled
                      className="border bg-gray-100 px-2 rounded text-[.9em]"
                    />
                    <input
                      type="text"
                      value={prop.value}
                      disabled
                      className="border bg-gray-100 px-2 rounded text-[.9em] flex-1"
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2"
                      onClick={() => handleRemoveProperty(idx)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={newPropertyKey}
                  onChange={e => setNewPropertyKey(e.target.value)}
                  className="border px-2 rounded text-sm w-[40%]"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newPropertyValue}
                  onChange={e => setNewPropertyValue(e.target.value)}
                  className="border px-2 rounded text-sm w-[50%]"
                />
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 rounded"
                  onClick={handleAddProperty}
                  disabled={
                    newPropertyKey.trim() === "" ||
                    newPropertyValue.trim() === ""
                  }
                  title="Tambah Property"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5">
                Simpan Unit
              </Button>
            </div>
          </form>

          {/* Presisi Editor */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">Editor Presisi Koordinat</h4>
            <div className="space-y-4">
              {Array.from({ length: points.length / 2 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                      Node {i + 1}
                    </span>
                    <button
                      onClick={() => removePoint(i)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                      disabled={points.length <= 6}
                      type="button"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">
                        X Position
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCoordinate(i, "x", points[i * 2] - 1)}
                          className="bg-gray-200 px-2 rounded"
                          type="button"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={Math.round(points[i * 2])}
                          onChange={e =>
                            updateCoordinate(
                              i,
                              "x",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full text-center text-sm border rounded p-1"
                        />
                        <button
                          onClick={() => updateCoordinate(i, "x", points[i * 2] + 1)}
                          className="bg-gray-200 px-2 rounded"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">
                        Y Position
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateCoordinate(i, "y", points[i * 2 + 1] - 1)
                          }
                          className="bg-gray-200 px-2 rounded"
                          type="button"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={Math.round(points[i * 2 + 1])}
                          onChange={e =>
                            updateCoordinate(
                              i,
                              "y",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full text-center text-sm border rounded p-1"
                        />
                        <button
                          onClick={() =>
                            updateCoordinate(i, "y", points[i * 2 + 1] + 1)
                          }
                          className="bg-gray-200 px-2 rounded"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-2 uppercase font-bold">Array Koordinat Polygon</p>
              <code className="text-emerald-400 text-[10px] break-all">
                [{points.map((p) => Math.round(p)).join(", ")}]
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;