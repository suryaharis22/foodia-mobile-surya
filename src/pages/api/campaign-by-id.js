import { decryptId } from '@/utils/EndCodeHelper1';
import axios from 'axios';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Invalid campaign ID' });
    }


    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching campaign data:", error);
        res.status(error.response?.status || 500).json({ message: 'Error fetching campaign data' });
    }
}
