import { useEffect, useState } from "react";
import { dummyThumbnails, type IThumbnail } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";

const MyGeneration= () => {
        const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
        const navigate = useNavigate();
        const [loading, setLoading] = useState(false);

        const fetchThumbnails = async () => {
            setThumbnails(dummyThumbnails as unknown as IThumbnail[]);
          setLoading(false);
        }

        const aspectRatioClassMap : Record<string, string>={
            "16:9": "aspect-video",
            "4:3": "aspect-[4/3]",
            "1:1": "aspect-square",
            "9:16": "aspect-[9/16]",
        };





        const handleDownload = (image_url : string) => {
            window.open(image_url, '_blank');
        }

        const handleDelete = (id : string) => {
            console.log(id);
        }

        useEffect(()=>{
            fetchThumbnails();
        },[])

    return (
        <>
        <SoftBackdrop />
        <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
            {/* Content for My Generation Page */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-200">My Generated Thumbnails</h1>
                <p className="text-sm text-zinc-400 mt-1">view and manage all your AI-generated thumbnails</p>
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length:6}).map((_,i)=>(
                    <div key={i} className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]" />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && thumbnails.length === 0 && (
                <div className="text-center py-24">
                    <h3 className="text-lg font-semibold text-zinc-200">No thumbnails generated yet</h3>
                    <p className="text-sm text-zinc-400">Generate your first thumbnail to see it here.</p>
                </div>
            )}

            {/* THUMBNAILS GRID */}

            {!loading && thumbnails.length > 0 && (
                <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
                    {thumbnails.map((thumb : IThumbnail)=>{
                        const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9' ] 
                        return (
                            <div key={thumb._id}  onClick ={()=>navigate(`/generate/${thumb._id}`)}
                            className="mb-8 group relative cursor-pointer  rounded-2xl bg-white/6 border border-white/10 shadow-xl transition
                            break-inside-avoid">

                                {/* IMAGE */}
                                <div className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}>
                                    {thumb.image_url ? (
                                    <img src={thumb.image_url} alt={thumb.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-sm text-zinc-400"> {thumb.isGenerating ? 'Generating...' : 'No Image Available'}
                                        </div>
                                    )}
                                    {thumb.isGenerating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                                        Generating...
                                    </div>}
                                </div>
                                {/* DETAILS */}
                                <div className="p-4 space-y-2">
                                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">{thumb.title}</h3>

                                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                                        <span className="px-2 py-0.5 rounded bg-white/8">{thumb.style}</span>

                                        <span className="px-2 py-0.5 rounded bg-white/8">{thumb.color_scheme}</span>

                                        <span className="px-2 py-0.5 rounded bg-white/8">
                                        {thumb.aspect_ratio}</span>

                                    </div>
                                    <p className="text-xs text-zinc-500">{new Date(thumb.createdAt!).toDateString()}</p>
                                </div>

                                <div  onClick={(e)=>e.stopPropagation()} className="absolute bottom-2 right-2 max-sm:flex gap-1.5 sm:hidden group-hover:flex">

                                    <TrashIcon onClick={()=>handleDelete(thumb._id)} className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"/>

                                    <DownloadIcon onClick={()=>handleDownload(thumb._id)} className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"/>

                                        <Link target="_blank" to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`}>

                                    <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"/>
                                    </Link>
                                </div>
                            </div>
                        )
                        
                    })}
                    </div>
            )}
        </div>
        </>
    );
}

export default MyGeneration;