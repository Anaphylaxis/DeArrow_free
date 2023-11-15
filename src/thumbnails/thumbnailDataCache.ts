import { VideoID } from "../../maze-utils/src/video";

export interface PlaybackUrl {
    url: string;
    width: number;
    height: number;
}

interface ThumbnailVideoBase {
    video: HTMLVideoElement | null;
    width: number;
    height: number;
    onReady: Array<(video: RenderedThumbnailVideo | null) => void>;
    timestamp: number;
}

export type RenderedThumbnailVideo = ThumbnailVideoBase & {
    blob: Blob;
    rendered: true;
    fromThumbnailCache: boolean;
}

export type ThumbnailVideo = RenderedThumbnailVideo | ThumbnailVideoBase & {
    rendered: false;
};

export interface FailInfo {
    timestamp: number;
    onReady: Array<(video: RenderedThumbnailVideo | null) => void>;
}

interface VideoMetadata {
    playbackUrls: PlaybackUrl[];
    duration: number | null;
    channelID: string | null;
    author: string | null;
    isLive: boolean | null;
    isUpcoming: boolean | null;
}

export interface ThumbnailData {
    video: ThumbnailVideo[];
    metadata: VideoMetadata;
    failures: FailInfo[];
    thumbnailCachesFailed: Set<number>;
}

interface ThumbnailDataCacheRecord extends ThumbnailData {
    lastUsed: number;
}

//todo: set a max size of this and delete some after a while
const cache: Record<VideoID, ThumbnailDataCacheRecord> = {};
const cacheLimit = 2000;

export function getFromCache(videoID: VideoID): ThumbnailData | undefined {
    return cache[videoID];
}

export function setupCache(videoID: VideoID): ThumbnailData {
    if (!cache[videoID]) {
        cache[videoID] = {
            video: [],
            metadata: {
                playbackUrls: [],
                duration: null,
                channelID: null,
                author: null,
                isLive: false,
                isUpcoming: false
            },
            lastUsed: Date.now(),
            failures: [],
            thumbnailCachesFailed: new Set()
        };

        if (Object.keys(cache).length > cacheLimit) {
            const oldest = Object.entries(cache).reduce((a, b) => a[1].lastUsed < b[1].lastUsed ? a : b);
            delete cache[oldest[0]];
        }
    }

    return cache[videoID];
}

export function cacheUsed(videoID: VideoID): boolean {
    if (cache[videoID]) cache[videoID].lastUsed = Date.now();

    return !! cache[videoID];
}