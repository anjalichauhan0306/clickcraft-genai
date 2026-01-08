import { Request , Response } from "express"
import Thumbnail from "../models/Thumbnail.js";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
import path from "node:path";
import fs from 'fs';
import {v2 as cloudinary} from 'cloudinary'
import { InferenceClient } from "@huggingface/inference";
import ai from "../configs/ai.js";


const stylePrompt={'Bold & Graphic': 'eye-catching thumbnail,bold typography , vibrant colors , ecpressive facial reaction , dramatic lighting , high contrast , click-worthy composition , proffessional style',
'Tech/Futuristi':'futuristic thumbnail, sleek modern design , digital ui elements , glowing accents , holographics effects, cyber-tech aesthetic , sharp lighting , high-tech atsmophiere',

'Minimalist':'minimalist thumbnail. clean layout , simple shapes , limited color palatte , plenty of negative space , modern flat design , cear focal point',

'photorealistic':'photorealistic thumbnail . ultra-realistic lighting , natural skin tones , candid moment , DSLR-style photography , lifestyle realism , shallow depth of field',

'Illustrated':'illustrated thumbnail . xustom digital isllstration . stylized characters . bold outlines , vibrant colors cartoon or vector art style',

}

const colorSchemeDescriptions = {
    vibrant  : 'vibrant and eneretic colors . high saturation , bold contrasts , eye-catching palette',

    sunset : 'warm sunset tones , orange pink and purple hues , soft gradients , cinematic glow',
                                         
    forest : 'natural green tones , earthy colors , cal and organic palette , gresh atmosphere',

    noen :'neon glow errects , electric blues and pinks m cyberpunk lighting , high contast glow ',

    purple:'porlple-domenant color palette , magenta and voilet tones , modern and stylish mood',

    monochrome:'black and white color shceme , high contrast , dramatic lighing , timeless aesthitic ',

    ocean :'cool blue and teal tones , awutic color palette , fresh and clean atmosphere',

    pastel:'soft pastel colors , low saturation , gentle tones calrm and friendly aesthitic'
}
 
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY)


export const generateThumbnail = async(req : Request, res : Response)=>{
        try{

            const {userId} = req.session;
            const {
                title, prompt :user_prompt, style , aspect_ratio, color_scheme, text_overlay} =  req.body;
                
                const thumbnail = await Thumbnail.create({
                    userId, title, prompt_used: user_prompt,
                    user_prompt,
                    style,
                    aspect_ratio,
                    color_scheme,
                    text_overlay,
                    isGenerating: true
                })

                const model = 'gemini-3-pro-image-preview';
                const generationConfig : GenerateContentConfig = {
                    maxOutputTokens:32767,
                    temperature:1,
                    topP:0.95,
                    responseModalities:['IMAGE'],
                    imageConfig:{
                        aspectRatio: aspect_ratio || '16:9',
                        imageSize:'1K'
                    },
                    safetySettings:[
                        {category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,threshold:HarmBlockThreshold.OFF},
                        {category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold:HarmBlockThreshold.OFF},
                        { category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold:HarmBlockThreshold.OFF},
                        {category:HarmCategory.HARM_CATEGORY_HARASSMENT,threshold:HarmBlockThreshold.OFF}
                    ]
                }

                let prompt = `create a ${stylePrompt [style as keyof typeof stylePrompt]} For :"${title}"`;
                
                if(color_scheme){
                    prompt += `use a ${colorSchemeDescriptions[color_scheme as  keyof typeof colorSchemeDescriptions]} color scheme. `
                }

                if(user_prompt){
                    prompt += `additional details : ${user_prompt}`
                }

                prompt += ` The thumbnail  should be ${aspect_ratio} ,visually stuning and desinged to maximize click-throunght rate. make it bold , professional and impossible to ignore.`;
                
                const response:any = await ai.models.generateContent({
                    model,
                    contents:[prompt],
                    config:generationConfig
                })

                if(!response?.candidates?.[0]?.content?.parts){
                    throw new Error('unexepected response')
                }
                const parts = response.candidates[0].content.parts;

                let finalBuffer : Buffer | null = null;

                for(const part of parts){
                    if(part.inlineData){
                        finalBuffer = Buffer.from(part.inlineData.data,'base64')
                    }
                }

         

                const filename = `final-output-${Date.now()}.png`;
                const filepath = path.join('image',filename);
                
                // create the images directory if not exixts 

                fs.mkdirSync('image',{recursive:true})
                fs.writeFileSync(filepath,finalBuffer!);

                if (!finalBuffer) {
  throw new Error("Image generation failed");
}


                const uploadResult = await  cloudinary.uploader.upload(filepath,{resource_type : 'image',
                    folder: "ai-thumbnails",}
                )

                thumbnail.image_url = uploadResult.secure_url;
                thumbnail.isGenerating = false;

                await thumbnail.save()

                res.json({message : 'thumbnail generated' , thumbnail })

                // remove the file from disk 

                fs.unlinkSync(filepath)

            }
            catch(error :any){
                console.log(error);
                res.status(500).json({message :error.message})
            }
        }

export const deleteThumbnail = async (req:Request ,res:Response)=>{
    try{
        const {id} = req.params;
        const {userId} = req.session;

        await Thumbnail.findByIdAndDelete({_id:id,userId})

        res.json({message:"Thumbnail deleted successfully"});

    }catch(error : any){
        console.log(error)
        res.status(500).json(error.message);
    }
}