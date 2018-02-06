export const UPDATE_SONG_INFO = 'UPDATE_SONG_INFO';
export const UPDATE_PLAY_LIST = 'UPDATE_PLAY_LIST';
export const UPDATE_PLAY_STATUS = 'UPDATE_PLAY_STATUS';

export function updatePlayStatus(data) {
    return {
        type: UPDATE_PLAY_STATUS,
        data
    };
}

export function updateSongInfo(data) {
    return {
        type: UPDATE_SONG_INFO,
        data
    };
}

export function updatePlayList(data) {
    return {
        type: UPDATE_PLAY_LIST,
        data
    };
}