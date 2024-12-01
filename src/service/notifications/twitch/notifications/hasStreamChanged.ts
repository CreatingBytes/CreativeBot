export function hasStreamChanged(oldStream: any, newStream: any): boolean {
    console.log('Checking stream change:', oldStream, newStream)
    const viewerCountChanged = Math.abs(oldStream.viewer_count - newStream.viewer_count) >= 1;
    return oldStream.title !== newStream.title ||
        oldStream.thumbnail_url !== newStream.thumbnail_url ||
        oldStream.game_name !== newStream.game_name ||
        oldStream.viewer_count !== newStream.viewer_count || viewerCountChanged;
}