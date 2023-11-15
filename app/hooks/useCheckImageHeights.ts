import { useEffect, useState } from "react";

const useCheckImageheights = (urls: string[]): Boolean =>  {
    const [height, setHeight] = useState<Number[]>([]);

    useEffect(() => {
        const checkQrCode = async () => {
            for (const url of urls) {
                try {
                    const response = await fetch("/api/imageheight", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ url }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                   
                    if(data.imageURI){
                        setHeight((prev) => [...prev, data.imageURI] )
                    }

                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };

        checkQrCode();
    }, []);

    return height.every((e:Number) => e === height[0]);
}

export default useCheckImageheights