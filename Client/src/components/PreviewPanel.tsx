import type { AspectRatio, IThumbnail } from '../assets/assets';
import { DownloadIcon, ImageIcon, Loader2Icon } from 'lucide-react';

const PreviewPanel = ({thumbnail,isLoading,aspectRatios} :{thumbnail: IThumbnail | null,isLoading : boolean;aspectRatios :AspectRatio}) => {
    const aspectClasses = {
        '16:9':'aspect-video',
        '1:1':'aspect-square',
        '9:16': 'aspect-[9/16]',
    } as Record<AspectRatio , String>;

    const onDownload = () => {
        if(!thumbnail?.image_url) return;
        window.open(thumbnail.image_url, '_blank');
    }

    return (
        <div className='relative mx-auto w-full max-w-2xl'>
            <div className={`relative overflow-hidden ${aspectClasses[aspectRatios]}`}>
            {/*  Loading State */}      
                {
                    isLoading && (
                        <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25'>
                            <Loader2Icon className='size-8 animate-spin text-zinc-400'/>
                            <div>
                                <p className='text-sm text-zinc-200 font-medium'>AI is Creating your thumbnail.....</p>
                                <p className='mt-1 text-xs text-zinc-400'>This may take 10 - 20 seconds.</p>
                            </div>
                        </div>
                    )}
                    {/* Thumbnail Preview */}

                    {!isLoading && thumbnail?.image_url && (
                        <div className='group relative w-full h-full'>
                            <img src={thumbnail?.image_url} alt={thumbnail.title} className='object-cover w-full h-full' />

                            <div className='absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <button onClick={onDownload} type='button' className='mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-medium transition bg-black/30 ring-2 ring-white/40
                                backdrop-blur-sm hover:scale-105 active:scale-95'>
                                    <DownloadIcon className='size-4' />
                                    Download Thumbnail
                                </button>
                            </div>
                        </div>
                    )}

                {/** Placeholder State */}
                {!isLoading && !thumbnail?.image_url && (
                    <div className='absolute inset-0 m-2 flex flex-col items-center gap-4 rounded-lg border-2  border-dashed border-white/20 bg-black/25 justify-center'>

                        <div className='max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10'>
                             <ImageIcon className='size-10 text-white opacity-50' />
                        </div>   
                        <div className='px-4 text-center'>
                        <p className='font text-zinc-200'>Generate your First Thumbnail</p>
                        <p className='mt-1 text-xs text-zinc-400'>Fill Out the Form and Click Generate</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreviewPanel;
