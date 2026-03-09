"use client";
import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Line, Circle, Group } from "react-konva";
import Konva from "konva";

interface StaticMesh {
  id: string;
  points: number[];
  color: string;
  label: string;
}

const KonvaEditorTS: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [points, setPoints] = useState<number[]>([100, 100, 300, 100, 300, 300, 100, 300]);

  // Data mesh statis yang diambil dari array of objects
  const staticMeshesData: StaticMesh[] = [
    { id: "m1", label: "Area A", color: "#ef4444", points: [500, 90, 550, 50, 550, 150, 450, 150] },
    { id: "m2", label: "Area B", color: "#ef4444", points: [600, 200, 750, 250, 700, 400, 550, 350] },
  ];

  useEffect(() => {
    const img = new window.Image();
    img.src = "/siteplan.png"; 
    img.onload = () => setImage(img);
  }, []);

  // Handler untuk input manual (Presisi)
  const updateCoordinate = (index: number, axis: 'x' | 'y', value: number) => {
    const newPoints = [...points];
    newPoints[index * 2 + (axis === 'y' ? 1 : 0)] = value;
    setPoints(newPoints);
  };

  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const removePoint = (index: number) => {
    if (points.length <= 6) return; // Minimal 3 titik untuk membentuk polygon
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
    const scaleBy = 1.1; // Kecepatan zoom
    const stage = e.target.getStage();
    const oldScale = stage?.scaleX();
    
    const pointer = stage?.getPointerPosition();
  
    if (!pointer || !stage || oldScale === undefined) return;

    const mousePointTo = {
      x: (pointer.x - (stage.x() ?? 0)) / oldScale,
      y: (pointer.y - (stage.y() ?? 0)) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStage({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div className="flex flex-col items-start lg:flex-row p-6 bg-gray-100 min-h-screen gap-6">
      {/* Kiri: Canvas Editor */}
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-4 flex gap-2">
          <button 
            onClick={() => setPoints([...points, points[points.length-2] + 20, points[points.length-1] + 20])}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-700"
          >
            Tambah Titik +
          </button>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-xl border border-gray-300">
          <Stage onWheel={handleWheel} scaleX={stage.scale} scaleY={stage.scale} x={stage.x} y={stage.y} draggable width={800} height={500}>
            <Layer>
              {image && <Image image={image} width={800} height={500} opacity={0.5} />}

              {/* Render Multiple Static Meshes */}
              {staticMeshesData.map((mesh) => (
                <Line
                  key={mesh.id}
                  points={mesh.points}
                  closed
                  opacity={0.3}
                  stroke={mesh.color}
                  strokeWidth={2}
                  fill={`${mesh.color}22`} // hex + opacity
                  dash={[4, 4]}
                />
              ))}

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
                    onMouseEnter={(e) => (e.target.getStage()!.container().style.cursor = "move")}
                    onMouseLeave={(e) => (e.target.getStage()!.container().style.cursor = "default")}
                  />
                ))}
              </Group>
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Kanan: Control Panel & Coordinates */}
      <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-y-auto max-h-[85vh]">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Editor Presisi</h3>
        
        <div className="space-y-4">
          {Array.from({ length: points.length / 2 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Node {i + 1}</span>
                <button 
                  onClick={() => removePoint(i)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Hapus
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Input X */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">X Position</label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCoordinate(i, 'x', points[i*2] - 1)} className="bg-gray-200 px-2 rounded">-</button>
                    <input 
                      type="number" 
                      value={Math.round(points[i * 2])}
                      onChange={(e) => updateCoordinate(i, 'x', parseInt(e.target.value) || 0)}
                      className="w-full text-center text-sm border rounded p-1"
                    />
                    <button onClick={() => updateCoordinate(i, 'x', points[i*2] + 1)} className="bg-gray-200 px-2 rounded">+</button>
                  </div>
                </div>

                {/* Input Y */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Y Position</label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCoordinate(i, 'y', points[i*2+1] - 1)} className="bg-gray-200 px-2 rounded">-</button>
                    <input 
                      type="number" 
                      value={Math.round(points[i * 2 + 1])}
                      onChange={(e) => updateCoordinate(i, 'y', parseInt(e.target.value) || 0)}
                      className="w-full text-center text-sm border rounded p-1"
                    />
                    <button onClick={() => updateCoordinate(i, 'y', points[i*2+1] + 1)} className="bg-gray-200 px-2 rounded">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-900 p-4 rounded-lg">
           <p className="text-gray-400 text-xs mb-2 uppercase font-bold">Output Array</p>
           <code className="text-emerald-400 text-[10px] break-all">
             [{points.map(p => Math.round(p)).join(", ")}]
           </code>
        </div>
      </div>
    </div>
  );
};

export default KonvaEditorTS;