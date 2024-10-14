import { Request, Response } from "express";
import axios from "axios"; // Ensure axios is imported
import { formatResponse } from "../../helpers";

export const sendTestOtp = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Define the request body
        const requestBody = {
            uip_head: {
                METHOD: "SMS_SEND_REQUEST",
                SERIAL: 1,
                TIME: "2024-05-0900:00:00", // Adjust the date format if needed
                CHANNEL: process.env.OTP_CHANNEL,
                AUTH_KEY: process.env.OTP_AUTH_KEY,
            },
            uip_body: {
                uip_version: 2,
                SMS_CONTENT: "Your OTP:10-07-2024", // Change OTP message if needed
                DESTINATION_ADDR: ["971547626241"],
                ORIGINAL_ADDR: "WL-SMS"
            }
        };

        // Make the POST request to the external API
        const response = await axios.post('https://cloudsms.jegotrip.com:1820/uips', requestBody, {
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            }
        });

        // Handle the response from the SMS API
        const data = formatResponse(200, false, 'OTP sent successfully', response.data);
        res.status(200).json(data);
    } catch (e: any) {
        console.log(e);
        const data = formatResponse(500, true, e.message, null);
        res.status(500).json(data);
        return;
    }
};
