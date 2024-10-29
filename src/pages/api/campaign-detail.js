import { decryptId } from '@/utils/EndCodeHelper1';
import axios from 'axios';

export default async function handler(req, res) {
    const { idCamp, type } = req.query;


    const queryParams = new URLSearchParams({
        campaign_id: idCamp,
        type: type,
    });

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/filter?${queryParams.toString()}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching campaign reports:", error);
        res.status(error.response?.status || 500).json({ message: 'Error fetching campaign reports' });
    }
}
