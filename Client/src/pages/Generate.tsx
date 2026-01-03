import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { colorSchemes, dummyThumbnails, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";

const Generate = () => {
    const { id } = useParams();
    const [title, setTitle] = React.useState("");
    const [additionalDetails, setAdditionalDetails] = React.useState("");
    const [thumbnail, setThumbnail] = React.useState<IThumbnail | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [aspectRatios,setAspectRatio] = useState<AspectRatio>('16:9')

    const [style,setStyle] = useState<ThumbnailStyle>('Bold & Graphic')
 
   const [colorSchemaId ,  setColorSchemaId] = useState<String>(colorSchemes[0].id)
    
    const [styleDropdownOpen,setStyleDropdownOpen] = useState(false)

    const handleGenerate = async () => {

    }

    const fetchThumbnail = async () => {
        if(id){
            const thumbnail : any = dummyThumbnails.find((thumbnail)=>thumbnail._id === id);
            setThumbnail(thumbnail);
            setAdditionalDetails(thumbnail.user_prompt);
            setTitle(thumbnail.title);
            setAspectRatio(thumbnail.aspect_ratio);
            setStyle(thumbnail.style);
            setColorSchemaId(thumbnail.color_scheme);
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(id){
            fetchThumbnail();
        }
    },[id])
    return (
        <>
        <SoftBackdrop />
        <div className="pt-24 min-h-screen">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
                <div className="grid lg:grid-cols-[400px_1fr] gap-8">
                    
                 {/* LEFT PANEL */}
                 <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
                      <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                      <div>
                         <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail </h2>
                        <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life</p>
                        </div>

                        <div className="space-y-5">
                        {/* Title Input */}
                        <div className="space-y-2">   
                            <label className="block text-sm font-medium"> Title Or Topic </label>
                            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} maxLength={100} placeholder="e.g. 10 Tips for Better Sleep" className="w-full px-4 py-3  rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />

                            <div className="flex justify-end">
                                <span className="text-xs text-zinc-400">
                                    {title.length}/100
                                </span>
                            </div>

                            {/**AsectRatioSelector */}
                            <AspectRatioSelector value={aspectRatios} onChange={setAspectRatio}/>


                            {/**StyleSelector */}
                            <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen}/>

                            {/* ColorSchemeSelector */}

                            <ColorSchemeSelector value={colorSchemaId} onChange={setColorSchemaId} />
                            {/* Additional Details Input */}
                            <div className="space-y-2">
                                <label>Addtional Prompts <span className ="text-zinc-400 text-xs"> (optional) </span></label>
                                <textarea value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3} placeholder="Add Any specific elements , mood , or style preferences..." className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                        {/* Button */}
                        {!id && (
                            <button onClick={handleGenerate} className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors">
                                {loading ? "Generating..." : "Generate Thumbnail"}</button>
                        )}
                        </div>
                     </div>

                    {/* RIGHT PANEL */}
                    <div>
                        <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl ">
                            <h2>Preview</h2>
                            <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatios={aspectRatios} />
                        </div>
                    </div>
                 </div>
            </main>
            </div>
        </>
    );
}

export default Generate;