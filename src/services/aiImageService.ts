import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const IMAGE_MAPPING: Record<string, string> = {
  'NovaPods X': '/src/assets/NovaPods-X.png',
  'FluxWatch Pro': '/src/assets/FluxWatch-Pro.png',
  'AeroCharge Dock': '/src/assets/AeroCharge-Dock.png',
  'Vision Goggles v2': '/src/assets/Vision-Goggles-v2.png',
  'NovaCase Ultra': '/src/assets/NovaCase-Ultra.png',
  'FluxPad Max': '/src/assets/FluxPad-Max.png'
};

export async function generateProductImage(productName: string, productDescription: string) {
  // Check if we have a local asset for this product
  if (IMAGE_MAPPING[productName]) {
    return IMAGE_MAPPING[productName];
  }

  // Return a high-quality placeholder by default as requested
  const seed = encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'));
  return `https://picsum.photos/seed/${seed}/1200/1200`;

  /* AI generation logic preserved but bypassed for now
  try {
    const prompt = `A high-quality, professional product photography of ${productName}. ${productDescription}. Minimalist Apple-inspired aesthetic, clean white background, soft studio lighting, 8k resolution, highly detailed.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    throw new Error('No image generated');
  } catch (error) {
    console.error('Error generating AI image:', error);
    throw error;
  }
  */
}
