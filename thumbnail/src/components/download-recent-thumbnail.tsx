"use client"

import { downloadS3File } from "~/app/actions/aws";
import { Button } from "./ui/button";

const DownloadRecentThumbnail = ({ url }: { url: string }) => {
    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        const downloadUrl = await downloadS3File(url);
        window.location.href = downloadUrl;
    };

    return (
        <Button onClick={handleDownload}
            className="w-full" variant="outline">
            Download
        </Button>
    );
};

export default DownloadRecentThumbnail;
