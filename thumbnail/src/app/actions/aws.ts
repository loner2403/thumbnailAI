"use server"

import AWS from "aws-sdk";
import { redirect } from "next/navigation";
import { env } from "~/env";
import { auth } from "~/server/auth";

const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
    region: env.AWS_REGION

})

export const getPresignedUrl = async () => {
    const serverSession = await auth();

    if(!serverSession || !serverSession.user?.id) {
        throw new Error("User not authenticated");
    }

    // Format date as yyyyMMddHHmmss
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const userId = serverSession.user.id;
    const key = `${userId}/thumbnail-${timestamp}.png`;

    const params = {
        Bucket: env.AWS_THUMBNAIL_BUCKET,
        Key: key,
        Expires: 60,
        ContentType: "image/png"
    };

    const uploadUrl = s3.getSignedUrl("putObject", params);

    return uploadUrl;
}

export const downloadS3File = async (url: string) => {
    const serverSession = await auth();

    if(!serverSession) {
        throw new Error("User not authorized");
    }

    const key = url.replace(
        `https://${env.AWS_THUMBNAIL_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`,
        ""
    )

    const params = {
        Bucket: env.AWS_THUMBNAIL_BUCKET,
        Key: key,
        Expires: 3600,
        ResponseContentDisposition: 'attachment; filename="thumbnail.png"',
    };

    const downloadUrl = s3.getSignedUrl("getObject", params);

    return downloadUrl;
}
