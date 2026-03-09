"use client"
import ENDPOINT from "@/config/url";
import { MapObject } from "@/objects/map.object";
import CreateUnit from "@/user-components/shape-editor/unit-create";
import { axiosInstance } from "@/util/request.util";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const { slug } = useParams();
    const [product, setProduct] = useState<MapObject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            setError(null);

            try {
                const id = Array.isArray(slug) ? slug[0] : slug;
                const res = await axiosInstance.get(`${ENDPOINT.DETAIL_MAP(id ?? "")}`);
                if (!res.data) {
                    throw new Error("Failed to fetch Map");
                }
                const data = await res.data.data;
                console.log(data);
                
                setProduct(data);
            } catch (err: any) {
                setError(err.message || "Terjadi kesalahan saat mengambil data");
            }
            setLoading(false);
        }

        if (slug) {
            fetchProduct();
        }
    }, [slug]);
    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : product ? (
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">{product.title}</h2>
                    {product.description && (
                        <p className="text-gray-600">{product.description}</p>
                    )}
                </div>
            ) : (
                <div>Tidak ada data.</div>
            )}
            <CreateUnit map={product} />
        </div>
    )
}