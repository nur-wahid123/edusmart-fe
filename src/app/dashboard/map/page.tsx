"use client"
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ENDPOINT from "@/config/url"
import { MapObject } from "@/objects/map.object"
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook"
import { SquareArrowRightExit } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const { data, ref } = useInfiniteScroll<MapObject, HTMLDivElement>({
        filter: {},
        take: 20,
        url: ENDPOINT.LIST_MAP
    });

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Maps</h1>
            <div className="space-y-4">
                {(data ?? []).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Tidak ada data map.
                    </div>
                )}
                {(data ?? []).map((map, i) => (
                    <div
                        ref={data.length === i - 1 ? ref : undefined}
                        key={i}
                        className="rounded-lg p-5 bg-white shadow transition hover:shadow-lg border flex items-center"
                    >
                        <div className="flex-1">
                            <span className="block text-xl font-semibold text-gray-800">{map.title}</span>
                            {map.description && (
                                <p className="mt-1 text-gray-500 text-sm">{map.description}</p>
                            )}
                        </div>
                        <div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/dashboard/map/${map.id}`}>
                                    <Button variant="outline">
                                        <SquareArrowRightExit/>
                                    </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Lihat Peta</p>
                                </TooltipContent>
                            </Tooltip>                        </div>
                        {/* Add any additional actions/info here if needed */}
                    </div>
                ))}
            </div>
        </div>
    )
}