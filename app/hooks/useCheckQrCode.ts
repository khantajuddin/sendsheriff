import { useEffect, useState } from "react";
import QrScanner from 'qr-scanner';

const useCheckQrCode = (urls: string[]) => {
    const [hasQr, setHasQr] = useState(false);

    useEffect(() => {
        const checkQrCode = async () => {
            for (const url of urls) {
                try {
                    const response = await fetch("/api/imageurltouri", {
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
                    const result = await QrScanner.scanImage(data.imageURI);

                    if (result) {
                        console.log(result);
                        setHasQr(true);
                        break; // Exit the loop if QR code is found
                    }

                    console.log("POST request successful. Response:", data);
                    // Handle the response data as needed
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };

        checkQrCode();
    }, []);

    return hasQr;
};

export default useCheckQrCode;
