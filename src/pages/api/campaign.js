// pages/api/campaign.js
import axios from 'axios';

export default async function handler(req, res) {
    const { status = "OPEN", per_page = 10, offset = 0 } = req.query;
    const token = req.headers.authorization?.split(' ')[1];

    const queryParams = new URLSearchParams({
        campaign_status: status,
        per_page: per_page,
    });

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?${queryParams.toString()}`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(error.response?.status || 500).json({ message: "Error fetching data" });
    }
}
