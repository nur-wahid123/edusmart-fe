import ENDPOINT from "@/config/url";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import KonvaEditorTS from "@/user-components/shape-editor/konva-editor";

export default function Page() {
    const {data} = useInfiniteScroll({filter:{},take:10,url:ENDPOINT.LIST_UNIT})
    return (
            <KonvaEditorTS />
    )
}