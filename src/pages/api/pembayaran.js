// src/pages/api/pembayaran.js
import axios from 'axios';
import { decryptId } from '@/utils/EndCodeHelper1';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { state, total, selectedMethod, selectedChannel, hiddenName, token } = req.body;

    try {
        const data = {
            amount: state.donation.amount,
            total_amount: total,
            payment_channel: selectedMethod === "agnostic" ? "Tabunganku" : selectedChannel,
            success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
            detail: {
                campaign_name: state.donation.detail.campaign_name,
                campaign_id: state.donation.detail.campaign_id,
                description: state.donation.detail.description,
                donation_type: state.donation.detail.donation_type,
            },
            hide_name: hiddenName,
        };

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const responeUrl = selectedMethod === "agnostic"
            ? response.data.body.channel_properties.success_redirect_url
            : response.data.body.actions.desktop_web_checkout_url;

        return res.status(200).json({
            success: true,
            url: responeUrl,
            external_id: response.data.body.external_id,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: {
                amount: state.donation.amount,
                total_amount: total,
                payment_channel: selectedMethod === "agnostic" ? "Tabunganku" : selectedChannel,
                success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
                detail: {
                    campaign_name: state.donation.detail.campaign_name,
                    campaign_id: state.donation.detail.campaign_id, // Menggunakan decryptId
                    description: state.donation.detail.description,
                    donation_type: state.donation.detail.donation_type,
                },
                hide_name: hiddenName,
            },  // Menyertakan data yang dikirim
        });
    }

}
